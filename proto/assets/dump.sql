--
-- PostgreSQL database dump
--

-- Dumped from database version 10.0
-- Dumped by pg_dump version 10.0

-- Started on 2017-10-27 21:27:05

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE sinf_db;
--
-- TOC entry 2801 (class 1262 OID 16393)
-- Name: sinf_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE sinf_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'Portuguese_Portugal.1252' LC_CTYPE = 'Portuguese_Portugal.1252';


ALTER DATABASE sinf_db OWNER TO postgres;

\connect sinf_db

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 1 (class 3079 OID 12924)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2804 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 196 (class 1259 OID 16406)
-- Name: customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE customer (
    customer_id text,
    account_id text,
    customer_tax_id text,
    company_name text,
    telephone text,
    fax text,
    id integer NOT NULL
);


ALTER TABLE customer OWNER TO postgres;

--
-- TOC entry 197 (class 1259 OID 16414)
-- Name: costumer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE costumer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE costumer_id_seq OWNER TO postgres;

--
-- TOC entry 2805 (class 0 OID 0)
-- Dependencies: 197
-- Name: costumer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE costumer_id_seq OWNED BY customer.id;


--
-- TOC entry 2671 (class 2604 OID 16416)
-- Name: customer id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY customer ALTER COLUMN id SET DEFAULT nextval('costumer_id_seq'::regclass);


--
-- TOC entry 2795 (class 0 OID 16406)
-- Dependencies: 196
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO customer VALUES ('Consumidor final', 'Desconhecido', '999999990', 'Consumidor final', NULL, NULL, 3);
INSERT INTO customer VALUES ('ES989922456_C', '21123004', '989922456', 'Soluciones Cad de Madrid, SA', '00.034.1.474747447', '00.034.1.4374747474', 4);
INSERT INTO customer VALUES ('AO823892388_C', '21113001', '823892388', 'Inforshow, Inform�tica Comunica��o', '00.66.9237293377', '00.66.464464646', 5);
INSERT INTO customer VALUES ('PT505678900_C', '21111003', '505678900', 'Jos� Maria Fernandes & Filhos, Lda.', '02.24949  49499', '2.2498448499', 6);
INSERT INTO customer VALUES ('PT202075133_C', 'Desconhecido', '202075133', 'Empreendimentos do Lima, Lda.', NULL, NULL, 7);
INSERT INTO customer VALUES ('GB9393878719-A_C', '21113002', '9393878719-A', 'MicroAvi, Inc.', '00.78.3883383838', '00.78.383838112', 8);
INSERT INTO customer VALUES ('PT123456789_C', '21111001', '123456789', 'Sofrio, Lda', '200267890', '200267899', 9);
INSERT INTO customer VALUES ('PT513686703_C', '21113006', '513686703', 'Maria Jos� da Silva', '253270444', '03982080', 10);


--
-- TOC entry 2806 (class 0 OID 0)
-- Dependencies: 197
-- Name: costumer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('costumer_id_seq', 10, true);


--
-- TOC entry 2673 (class 2606 OID 16418)
-- Name: customer costumer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY customer
    ADD CONSTRAINT costumer_pkey PRIMARY KEY (id);


--
-- TOC entry 2803 (class 0 OID 0)
-- Dependencies: 6
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2017-10-27 21:27:06

--
-- PostgreSQL database dump complete
--

