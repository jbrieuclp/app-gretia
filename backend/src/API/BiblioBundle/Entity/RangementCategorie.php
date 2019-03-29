<?php

namespace API\BiblioBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as Serializer;

/**
* @ORM\Entity
* @ORM\Table(name="biblio.rangement_categorie")
*/
class RangementCategorie
{
		/**
		 * @ORM\Id
		 * @ORM\Column(name="id_exemplaire_forme", type="integer")
		 * @ORM\GeneratedValue(strategy="SEQUENCE")
     * @ORM\SequenceGenerator(sequenceName="biblio.rangement_categorie_id_rangement_categorie_seq", allocationSize=1, initialValue=1)
		 *
		 * @Serializer\Groups({"rangements", "rangement_categories"})
		 */
		private $id;

		/**
		* @ORM\Column(name="libelle", type="string", length=255, nullable=false)
		*
		* @Serializer\Groups({"rangements", "rangement_categories"})
		*/
		private $libelle;

		/**
		* @ORM\Column(name="ordre", type="smallint", nullable=true)
		*
		* @Serializer\Groups({"rangements", "rangement_categories"})
		*/
		private $ordre;

		/**
	   * Get id
	   *
	   * @return integer 
	   */
	  public function getId()
	  {
	      return $this->id;
	  }

		/**
	   * Set libelle
	   *
	   * @param string $libelle
	   * @return string
	   */
	  public function setLibelle($libelle)
	  {
	      $this->libelle = $libelle;

	      return $this;
	  }

	  /**
	   * Get libelle
	   *
	   * @return integer 
	   */
	  public function getLibelle()
	  {
	      return $this->libelle;
	  }

	  /**
	   * Set ordre
	   *
	   * @param string $ordre
	   * @return string
	   */
	  public function setOrdre($ordre)
	  {
	      $this->ordre = $ordre;

	      return $this;
	  }

	  /**
	   * Get ordre
	   *
	   * @return integer 
	   */
	  public function getOrdre()
	  {
	      return $this->ordre;
	  }

}