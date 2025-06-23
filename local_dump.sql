--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Admin" (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Admin" OWNER TO postgres;

--
-- Name: Admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Admin_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Admin_id_seq" OWNER TO postgres;

--
-- Name: Admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Admin_id_seq" OWNED BY public."Admin".id;


--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AuditLog" (
    id integer NOT NULL,
    action text NOT NULL,
    "adminId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    details text
);


ALTER TABLE public."AuditLog" OWNER TO postgres;

--
-- Name: AuditLog_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."AuditLog_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."AuditLog_id_seq" OWNER TO postgres;

--
-- Name: AuditLog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."AuditLog_id_seq" OWNED BY public."AuditLog".id;


--
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- Name: Category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Category_id_seq" OWNER TO postgres;

--
-- Name: Category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;


--
-- Name: News; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."News" (
    id integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "categoryId" integer,
    "authorId" integer,
    "imageUrl" text,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    slug text NOT NULL
);


ALTER TABLE public."News" OWNER TO postgres;

--
-- Name: News_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."News_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."News_id_seq" OWNER TO postgres;

--
-- Name: News_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."News_id_seq" OWNED BY public."News".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Admin id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Admin" ALTER COLUMN id SET DEFAULT nextval('public."Admin_id_seq"'::regclass);


--
-- Name: AuditLog id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog" ALTER COLUMN id SET DEFAULT nextval('public."AuditLog_id_seq"'::regclass);


--
-- Name: Category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);


--
-- Name: News id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."News" ALTER COLUMN id SET DEFAULT nextval('public."News_id_seq"'::regclass);


--
-- Data for Name: Admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Admin" (id, name, email, password, "createdAt") FROM stdin;
1	Super Admin	admin@rsnnews.com	$2b$10$j043fswPOr/iVSrSnNLdfu0Xht7318ziqY/lq1J0.yu6ki2jKJVnu	2025-06-22 05:52:48.705
\.


--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AuditLog" (id, action, "adminId", "createdAt", details) FROM stdin;
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, name) FROM stdin;
6	general
\.


--
-- Data for Name: News; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."News" (id, title, content, "createdAt", "categoryId", "authorId", "imageUrl", "updatedAt", slug) FROM stdin;
17	🐛 Fix: Use Prisma relation connect for category in news creation API	🐛 Fix: Use Prisma relation connect for category in news creation API	2025-06-22 14:10:09.573	6	1	/uploads/1750601403419-af21ee3e0133.jpg	2025-06-22 16:11:16.454	-fix-use-prisma-relation-connect-for-category-in-news-creation-api-17506014
18	🐛 fix: ensure category badge always renders string in FeaturedNewsCard  🏷️ Safely display category as string or object with name property in badge ✅ Resolved ReactNode type error for category badge	🐛 fix: ensure category badge always renders string in FeaturedNewsCard\n\n🏷️ Safely display category as string or object with name property in badge\n✅ Resolved ReactNode type error for category badge	2025-06-22 15:04:27.321	6	1	/uploads/1750604664154-f639e0ce7cd1.jpg	2025-06-22 16:11:16.454	-fix-ensure-category-badge-always-renders-string-in-featurednewscard-safely-display-category-as-string-or-object-with-name-property-in-badge-resolved-reactnode-type-error-for-category-badge-17506046
19	🔒 feat: add Change Password form to admin settings page (DB-backed, best practices)  🛠️ Integrated password change form in settings 🗄️ Securely updates password in database ⚡ Uses dynamic import for client-only form rendering	🔒 feat: add Change Password form to admin settings page (DB-backed, best practices)\n\n🛠️ Integrated password change form in settings\n🗄️ Securely updates password in database\n⚡ Uses dynamic import for client-only form rendering\n	2025-06-22 16:01:23.518	6	1	/uploads/1750608081596-06579e37d51f.png	2025-06-22 16:11:16.454	feat-add-change-password-form-to-admin-settings-page-db-backed-best-practices-in
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
68ab13c7-657a-4be1-b4ad-96416f3ada08	268647c406c25796c30912713a1de79e4a5448ed7184636be1d5de5cbb0b5ae9	2025-06-22 06:37:01.168839+01	20250622053701_init_admin_model	\N	\N	2025-06-22 06:37:01.151536+01	1
63734fe0-65e4-4e48-a133-5f1916641ac2	406591c0bff354a0e90eb4988eeab176a00c6d909eac3140858f2d72bd8a4dfe	2025-06-22 06:59:30.665122+01	20250622055930_add_news_and_category_models	\N	\N	2025-06-22 06:59:30.632972+01	1
8816a5c6-a25e-4124-8fd8-8ff2ad552f59	9f6dc40104eebd0daa840fbfea396b25ba3423d15444feed148aad6b189ac994	2025-06-22 07:03:59.930485+01	20250622060359_fix_relations	\N	\N	2025-06-22 07:03:59.903873+01	1
07412bd8-ed0c-4e93-853e-d3eacb5f8145	f180237a5e12b3b75ee690b937e65f204ffa9bf0670ebcc76aa10bd6d3084b60	2025-06-22 13:45:45.492944+01	20250622124545_add_news_slug	\N	\N	2025-06-22 13:45:45.427038+01	1
c42cadba-f7ff-4ff5-95f8-a4af09186f1d	fb11fdf9ddd55bf06232470e1de74aa432bb40b014c3f469c9065761ffb21171	2025-06-22 14:00:47.87524+01	20250622130047_make_slug_required	\N	\N	2025-06-22 14:00:47.811715+01	1
\.


--
-- Name: Admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Admin_id_seq"', 1, true);


--
-- Name: AuditLog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AuditLog_id_seq"', 1, false);


--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Category_id_seq"', 7, true);


--
-- Name: News_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."News_id_seq"', 19, true);


--
-- Name: Admin Admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Admin"
    ADD CONSTRAINT "Admin_pkey" PRIMARY KEY (id);


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: News News_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."News"
    ADD CONSTRAINT "News_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Admin_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Admin_email_key" ON public."Admin" USING btree (email);


--
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- Name: News_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "News_slug_key" ON public."News" USING btree (slug);


--
-- Name: AuditLog AuditLog_adminId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: News News_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."News"
    ADD CONSTRAINT "News_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: News News_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."News"
    ADD CONSTRAINT "News_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

