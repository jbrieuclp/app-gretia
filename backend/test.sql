CREATE TABLE fos_user (id INT AUTO_INCREMENT NOT NULL, username VARCHAR(180) NOT NULL, username_canonical VARCHAR(180) NOT NULL, email VARCHAR(180) NOT NULL, email_canonical VARCHAR(180) NOT NULL, enabled TINYINT(1) NOT NULL, salt VARCHAR(255) DEFAULT NULL, password VARCHAR(255) NOT NULL, last_login DATETIME DEFAULT NULL, confirmation_token VARCHAR(180) DEFAULT NULL, password_requested_at DATETIME DEFAULT NULL, roles LONGTEXT NOT NULL COMMENT '(DC2Type:array)', UNIQUE INDEX UNIQ_957A647992FC23A8 (username_canonical), UNIQUE INDEX UNIQ_957A6479A0D96FBF (email_canonical), UNIQUE INDEX UNIQ_957A6479C05FB297 (confirmation_token), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB;
DROP INDEX FK_FORMATER ON exemplaire;
DROP INDEX FK_RANGER1_CAT1 ON exemplaire;
DROP INDEX FK_RANGER2_CAT2 ON exemplaire;
DROP INDEX FK_RANGER3_CAT3 ON exemplaire;
ALTER TABLE exemplaire CHANGE ID_RANGEMENT_CAT2 id_rangement_cat2 VARCHAR(255) DEFAULT NULL, CHANGE ID_RANGEMENT_CAT1 id_rangement_cat1 VARCHAR(255) DEFAULT NULL, CHANGE ID_RANGEMENT_CAT3 id_rangement_cat3 VARCHAR(255) DEFAULT NULL, CHANGE ID_FORME_PUBLICATION id_forme_publication VARCHAR(255) DEFAULT NULL, CHANGE PRECISION_LOCALISATION precision_localisation VARCHAR(255) DEFAULT NULL, CHANGE PUBLIC public VARCHAR(255) DEFAULT NULL;
ALTER TABLE exemplaire ADD CONSTRAINT FK_5EF83C929C12BBFD FOREIGN KEY (id_localisation) REFERENCES localisation (id_localisation);
ALTER TABLE exemplaire ADD CONSTRAINT FK_5EF83C92B72EAA8E FOREIGN KEY (id_publication) REFERENCES publication (id_publication);
ALTER TABLE exemplaire RENAME INDEX fk_localiser TO IDX_5EF83C929C12BBFD;
ALTER TABLE exemplaire RENAME INDEX fk_correspondre TO IDX_5EF83C92B72EAA8E;
DROP INDEX LIBELLE_GUILDE ON guilde_fonctionnelle;
ALTER TABLE guilde_fonctionnelle CHANGE LIBELLE_GUILDE libelle_guilde VARCHAR(255) DEFAULT NULL;
DROP INDEX LIBELLE_LOCALISATION ON localisation;
ALTER TABLE localisation CHANGE LIBELLE_LOCALISATION libelle_localisation VARCHAR(255) DEFAULT NULL;
DROP INDEX publi_unique ON publication;
ALTER TABLE publication CHANGE ID_STATUT_INTEGRATION id_statut_integration INT DEFAULT NULL, CHANGE ID_STATUT_SAISIE id_statut_saisie INT DEFAULT NULL, CHANGE TITRE_PUBLICATION titre_publication VARCHAR(255) DEFAULT NULL, CHANGE ANNEE_PARUTION annee_parution VARCHAR(255) DEFAULT NULL, CHANGE COLLECTION_PUBLICATION collection_publication VARCHAR(255) DEFAULT NULL, CHANGE VOLUME_PUBLICATION volume_publication VARCHAR(255) DEFAULT NULL, CHANGE NUMERO numero VARCHAR(255) DEFAULT NULL, CHANGE TOME_PUBLICATION tome_publication VARCHAR(255) DEFAULT NULL, CHANGE FASCICULE_PUBLICATION fascicule_publication VARCHAR(255) DEFAULT NULL, CHANGE NO_SERIE_PUBLICATION no_serie_publication VARCHAR(255) DEFAULT NULL, CHANGE AVANCEMENT_SAISIE avancement_saisie VARCHAR(255) DEFAULT NULL, CHANGE COMMENTAIRES_INTEGRATION commentaires_integration VARCHAR(255) DEFAULT NULL, CHANGE RELEVE_SERENA releve_serena VARCHAR(255) DEFAULT NULL, CHANGE NB_DONNEES_INTEGREES nb_donnees_integrees INT DEFAULT NULL, CHANGE PRECISION_ZONE_GEO precision_zone_geo VARCHAR(255) DEFAULT NULL, CHANGE IN_ZOTERO in_zotero INT DEFAULT NULL;
ALTER TABLE publication ADD CONSTRAINT FK_AF3C6779762AC9D FOREIGN KEY (id_statut_integration) REFERENCES statut_integration (id_statut_integration);
ALTER TABLE publication ADD CONSTRAINT FK_AF3C67798FFDBB9 FOREIGN KEY (id_statut_saisie) REFERENCES statut_saisie (id_statut_saisie);
ALTER TABLE publication RENAME INDEX fk_posseder_type_integration TO IDX_AF3C6779762AC9D;
ALTER TABLE publication RENAME INDEX fk_posseder_type_saisie TO IDX_AF3C67798FFDBB9;
DROP INDEX LIBELLE_RANGEMENT_CAT1 ON rangement_cat1;
ALTER TABLE rangement_cat1 CHANGE LIBELLE_RANGEMENT_CAT1 libelle_rangement_cat1 VARCHAR(255) DEFAULT NULL;
DROP INDEX LIBELLE_STATUT_INTEGRATION ON statut_integration;
ALTER TABLE statut_integration CHANGE LIBELLE_STATUT_INTEGRATION libelle_statut_integration VARCHAR(255) DEFAULT NULL;
DROP INDEX LIBELLE_STATUT_SAISIE ON statut_saisie;
ALTER TABLE statut_saisie CHANGE LIBELLE_STATUT_SAISIE libelle_statut_saisie VARCHAR(255) DEFAULT NULL;
DROP INDEX LIBELLE_TAXON ON taxon;
ALTER TABLE taxon CHANGE LIBELLE_TAXON libelle_taxon VARCHAR(255) DEFAULT NULL;
DROP INDEX LIBELLE_TERRITOIRE ON territoire;
ALTER TABLE territoire CHANGE LIBELLE_TERRITOIRE libelle_territoire VARCHAR(255) DEFAULT NULL;
ALTER TABLE concerner ADD CONSTRAINT FK_ABE9A8661DEFDF83 FOREIGN KEY (id_territoire) REFERENCES territoire (id_territoire);
ALTER TABLE concerner ADD CONSTRAINT FK_ABE9A866B72EAA8E FOREIGN KEY (id_publication) REFERENCES publication (id_publication);
CREATE INDEX IDX_ABE9A8661DEFDF83 ON concerner (id_territoire);
ALTER TABLE concerner RENAME INDEX fk_concerner2 TO IDX_ABE9A866B72EAA8E;
