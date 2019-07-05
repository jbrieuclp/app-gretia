<?php
namespace API\CartoBundle\Services\Cartographie;

use Symfony\Component\Security\Core\SecurityContext;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;
use Symfony\Component\Security\Core\Authorization\AuthorizationChecker;
use Symfony\Bundle\FrameworkBundle\Routing\Router;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Doctrine\ORM\EntityManager;

use \Symfony\Component\Yaml\Parser;

abstract class LayerService
{
   /**
    *
    * @var Connection
    */
    protected $em;
    protected $connection;
    private $context;
    protected $router;
    protected $request;

    /**
    *
    * @var clauses = array()
    * Clauses présentes dans le where
    */
    private $clauses = array();

    /**
    *
    * @var parametres = array()
    * Parametre à sortir dans fichier yml ou autre
    */
    protected $parameters;
    protected $queryBuilder;
    protected $criteres;
    protected $scale;
    protected $projection = 3857;
    protected $geojsonData = [];


    public function __construct(EntityManager $em, AuthorizationChecker $authorization, TokenStorage $context, Router $router, RequestStack $request)  {
        $this->em = $em;    
        $this->connection = $em->getConnection();    
        $this->authorization = $authorization; 
        $this->context = $context; 
        $this->router = $router; 
        $this->request = $request->getCurrentRequest();   
        $this->queryBuilder = $this->newQuery(); 

        $this->setScale();
        $this->setCriteres();
    }
	
    /**
     * Cette fonction recupère les données permettant de generer un geojson pour une echelle spécifié
     * Sortie : tableau associatif des données
     */
    public function getGeoJson($projection = 3857)
    {
        $this->setProjection($projection);

        //verification des droits d'accès aux données
        if ($this->checkScale()) {
            $this->setGeojsonData();
        }
    }

    /**
    * Cette fonction recupère les données attributaire liées à une maille
    * Sortie : tableau associatif des données
    */
    public function getInfoBulle($area)
	{
        $this->addCriteres('area', $area);
    }

    /**
    * Cette fonction recupère les données attributaire liées à une maille
    * Sortie : tableau associatif des données
    */
    public function getInfoCommune($area)
    {
        $this->addCriteres('area', $area);

        $qb = $this->queryBuilder;
        $qb->select("commune.area_code as insee_com, commune.area_name as nom_com")
           ->from('ref_geo.l_areas', 'a')
           ->innerJoin('a', 'pr_atlas.vm_atlas', 'atlas', 'a.id_area = atlas.id_area AND a.id_type = :type_geom')
           ->setParameter('type_geom', $this->getScale()->getType())
           ->innerJoin('atlas', 'gn_synthese.v_synthese_for_web_app', 's', 'atlas.id_synthese = s.id_synthese')
           ->innerJoin('atlas', 'ref_geo.l_areas', 'commune', 'commune.id_area = atlas.id_area_commune')
           ->groupBy('commune.area_code, commune.area_name');
    }
	
    protected function setGeojsonData() {
        $this->setGeojsonQuery();
        $this->setWhere();
        $this->geojsonData = $this->queryBuilder->execute()->fetchAll(\PDO::FETCH_ASSOC);
    }

    protected function getGeojsonData() {
        return $this->geojsonData;
    }
    
    protected function setCriteres(/*$maille_id = null*/) {
        $this->criteres = array(
                    'saisons' => $this->request->request->get('saisons'),
                    'periodes' => $this->request->request->get('periodes'),
                    'organisme' => $this->request->request->get('organisme'),
                    'territoire' => $this->request->request->get('territoire'),
                  );

        $this->setScalefilter();
    }

    protected function addCriteres($critere, $value) {

        if ( empty($critere) )
            throw new \Exception('variable $critere non renseignée', 1);
            
        $this->criteres[$critere] = $value;
    }

    protected function critereExist($critere) {
        //pour palier au bug de PHP < 5.4
        $criteres = $this->criteres;
        return (array_key_exists('filtre', $criteres) && !empty($criteres['filtre']));
    }

    protected function removeCriteres($critere) {
        if ( empty($critere) )
            throw new \Exception('variable $critere non renseignée', 1);

        if ( !in_array($critere, $this->criteres) )
            throw new \Exception('$critere inexistant dans le tableau', 1);
            
        unset($this->criteres[$critere]);
    }

    /**
     * Cette fonction permet de vérifier si l'utilisateur possède les droits d'accès à la données
     * Sortie : l'echelle autorisée
     */
    protected function checkScale()
    {
        return $this->getScale() !== null;
    }

    protected function setScale() {
        $this->scale = null;
        $scales = $this->em->getRepository('APICartoBundle:Scale')->getScaleForUser($this->context->getToken()->getUser()->getId());
        foreach ($scales as $scale) {
            if ($scale === $this->em->getRepository('APICartoBundle:Scale')->findOneByType($this->request->request->get('scale'))) {
                $this->scale = $scale;
            }
        }
    }

    protected function getScale() {
        return $this->scale;
    }
	
    /**
     * Cette fonction recupère les données permettant de générer un geojson pour une echelle spécifiée
     * Sortie : tableau associatif des données
     */
    public function setWhere()
    {
        foreach ($this->criteres as $key => $value) {
            if ( $this->__empty($value) ) {
                $fonction = 'set'.str_replace(' ', '', ucwords(str_replace('_', ' ', $key)));
                $this->$fonction($value);
            }
        }
    }
	
    protected function setProjection($projection) 
    {   
        $this->projection = $projection;
    }

    private function __empty($data) {
        return !empty($data);
    }

    protected function newQuery() {
        return $this->connection->createQueryBuilder();
    }
	
    /**
     * Cette fonction permet de retourner un tableau asso formatant le geojson correctement
     * Sortie : array('header' => $header, 'features' => $features, 'footer' => $footer);
     */
    public function makeGeoJson($projection = 3857)
    {
        $features = array();

        $rows = $this->getGeojsonData();
        foreach ($rows as &$data) {
            $pointage = $data['the_geom'];
            unset($data['the_geom']);
            $features[] = '{"type":"Feature","geometry":'.$pointage.',"properties":'.json_encode($data).'}';
            unset($data);
        }

        return '{"type": "FeatureCollection", "crs": {"type": "name", "properties": {"name": "EPSG:'.$this->projection.'"}}, "features": ['.implode(',', $features).']}';
    }


    /**
     * Cette fonction permet de retourner un tableau asso formatant le geojson correctement
     * Sortie : array('header' => $header, 'features' => $features, 'footer' => $footer);
     */
    public function makeInfoBulle()
    {
        $this->setInformationQuery();
        $this->setWhere();
        return $this->queryBuilder->execute()->fetch(\PDO::FETCH_ASSOC);
    }

    

    private function getMailleId($maille_id)
    {
		$sql = " (id_unique = '".str_replace("'", "''", $maille_id)."') ";
        
        return $sql;
    }

    protected function setSaisons($saisons)
    {
      if (!is_array($saisons) or !count($saisons)) return;

      $qb = $this->queryBuilder;
      $orModule = $qb->expr()->orx();

      foreach ($saisons as $saison) {
        $start = null;
        $end = null;
        if ( preg_match('/^([0-9]{2})\/([0-9]{2})$/', $saison['start']) and preg_match('/^([0-9]{2})\/([0-9]{2})$/', $saison['end'])) {
          $start = explode('/', $saison['start']);
          $end = explode('/', $saison['end']);
          $sql = "(extract('MONTH' FROM s.date_min) > ".(int)$start[1]." OR (extract('MONTH' FROM s.date_min) = ".(int)$start[1]." AND extract('DAY' FROM s.date_min) >= ".(int)$start[0]."))
                  AND (extract('MONTH' FROM s.date_max) < ".(int)$end[1]." OR (extract('MONTH' FROM s.date_max) = ".(int)$end[1]." AND extract('DAY' FROM s.date_max) <= ".(int)$end[0]."))";
          $orModule->add($sql);
        }
      }
      $qb->andWhere($orModule);
    }

    protected function setPeriodes($periodes)
    {
      if (!is_array($periodes) or !count($periodes)) return;

      $qb = $this->queryBuilder;
      $orModule = $qb->expr()->orx();

      foreach ($periodes as $periode) {
        if ( (preg_match('/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/', $periode['start']) or is_null($periode['start'])) 
            and (preg_match('/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/', $periode['end']) or is_null($periode['end'])) ) {
          $andModule = $qb->expr()->andx();
          if ( !is_null($periode['start']) ) {
            $andModule->add("s.date_min >= '".$periode['start']."'");
          }
          if ( !is_null($periode['end']) ) {
            $andModule->add("s.date_max <= '".$periode['end']."'");
          }
          $orModule->add($andModule);
        }
      }
      $qb->andWhere($orModule);
    }

    private function setTerritoire($territoire)
    {
        if (!is_array($territoire)) return;
		
		$val_ok = array();
        foreach ($territoire as $valeur) {
            if ( ctype_digit($valeur) ) {
                $val_ok[] = "'".(int) $valeur."'";
            }
        }

        if (count($val_ok) ) {
            $qb = $this->queryBuilder;
            $qb->innerJoin('d', 'territoire_commune', 'TERRI', 'd.insee = TERRI.insee_com')
               ->andWhere("TERRI.terri_id IN (".implode(',',$val_ok).")");
        }
    }

    private function setGeometry($geom)
    {
        if ($geom == '{}') return;
		
		$qb = $this->queryBuilder;
        $qb->andWhere("ST_Intersects(d.the_geom, ST_Transform(ST_SetSRID(ST_GeomFromGeoJSON('".$geom."'), 3857), 2154))");
    }

    private function setArea($area)
    {
        if (is_null($area)) return;
    		
    	$this->queryBuilder->andWhere("a.id_area = '".$area."'");
    }

    private function setScaleFilter()
    {
        $max = $this->em->getRepository('APICartoBundle:Scale')->getMaxRightForUser($this->getScale()->getType(), $this->context->getToken()->getUser()->getId());
        switch ($max) {
            case 2: //mes données
                $this->setMyData($this->context->getToken()->getUser()->getId());
                break;
            case 3: //mes données + organisme
                $this->setMyOrgData($this->context->getToken()->getUser()->getOrganisme());
                break;
        }
    }

    private function setMyData($id) {
        $this->queryBuilder->join('s', 'pr_occtax.v_releve_role_org', 'mydata', 's.unique_id_sinp_grp = mydata.unique_id_sinp_grp AND ARRAY['.$id.']::integer[] && mydata.roles');
    }

    private function setMyOrgData($id) {
        $this->queryBuilder
        ->join('s', 'pr_occtax.v_releve_role_org', 'mydata', 's.unique_id_sinp_grp = mydata.unique_id_sinp_grp')
        ->join('s', 'pr_occtax.v_releve_role_org', 'myorgdata', 's.unique_id_sinp_grp = myorgdata.unique_id_sinp_grp')
        ->addWhere('(ARRAY['.$id.']::integer[] && mydata.roles OR ARRAY['.$id.']::integer[] && myorgdata.organismes)');
    }
}