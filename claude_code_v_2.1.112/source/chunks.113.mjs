
// @from(Ln 283489, Col 4)
mU4 = p((low, uU4) => {
    function SVz(q) {
        var K = q.COMMENT("--", "$");
        return {
            name: "SQL (more)",
            aliases: ["mysql", "oracle"],
            disableAutodetect: !0,
            case_insensitive: !0,
            illegal: /[<>{}*]/,
            contains: [{
                beginKeywords: "begin end start commit rollback savepoint lock alter create drop rename call delete do handler insert load replace select truncate update set show pragma grant merge describe use explain help declare prepare execute deallocate release unlock purge reset change stop analyze cache flush optimize repair kill install uninstall checksum restore check backup revoke comment values with",
                end: /;/,
                endsWithParent: !0,
                keywords: {
                    $pattern: /[\w\.]+/,
                    keyword: "as abort abs absolute acc acce accep accept access accessed accessible account acos action activate add addtime admin administer advanced advise aes_decrypt aes_encrypt after agent aggregate ali alia alias all allocate allow alter always analyze ancillary and anti any anydata anydataset anyschema anytype apply archive archived archivelog are as asc ascii asin assembly assertion associate asynchronous at atan atn2 attr attri attrib attribu attribut attribute attributes audit authenticated authentication authid authors auto autoallocate autodblink autoextend automatic availability avg backup badfile basicfile before begin beginning benchmark between bfile bfile_base big bigfile bin binary_double binary_float binlog bit_and bit_count bit_length bit_or bit_xor bitmap blob_base block blocksize body both bound bucket buffer_cache buffer_pool build bulk by byte byteordermark bytes cache caching call calling cancel capacity cascade cascaded case cast catalog category ceil ceiling chain change changed char_base char_length character_length characters characterset charindex charset charsetform charsetid check checksum checksum_agg child choose chr chunk class cleanup clear client clob clob_base clone close cluster_id cluster_probability cluster_set clustering coalesce coercibility col collate collation collect colu colum column column_value columns columns_updated comment commit compact compatibility compiled complete composite_limit compound compress compute concat concat_ws concurrent confirm conn connec connect connect_by_iscycle connect_by_isleaf connect_by_root connect_time connection consider consistent constant constraint constraints constructor container content contents context contributors controlfile conv convert convert_tz corr corr_k corr_s corresponding corruption cos cost count count_big counted covar_pop covar_samp cpu_per_call cpu_per_session crc32 create creation critical cross cube cume_dist curdate current current_date current_time current_timestamp current_user cursor curtime customdatum cycle data database databases datafile datafiles datalength date_add date_cache date_format date_sub dateadd datediff datefromparts datename datepart datetime2fromparts day day_to_second dayname dayofmonth dayofweek dayofyear days db_role_change dbtimezone ddl deallocate declare decode decompose decrement decrypt deduplicate def defa defau defaul default defaults deferred defi defin define degrees delayed delegate delete delete_all delimited demand dense_rank depth dequeue des_decrypt des_encrypt des_key_file desc descr descri describ describe descriptor deterministic diagnostics difference dimension direct_load directory disable disable_all disallow disassociate discardfile disconnect diskgroup distinct distinctrow distribute distributed div do document domain dotnet double downgrade drop dumpfile duplicate duration each edition editionable editions element ellipsis else elsif elt empty enable enable_all enclosed encode encoding encrypt end end-exec endian enforced engine engines enqueue enterprise entityescaping eomonth error errors escaped evalname evaluate event eventdata events except exception exceptions exchange exclude excluding execu execut execute exempt exists exit exp expire explain explode export export_set extended extent external external_1 external_2 externally extract failed failed_login_attempts failover failure far fast feature_set feature_value fetch field fields file file_name_convert filesystem_like_logging final finish first first_value fixed flash_cache flashback floor flush following follows for forall force foreign form forma format found found_rows freelist freelists freepools fresh from from_base64 from_days ftp full function general generated get get_format get_lock getdate getutcdate global global_name globally go goto grant grants greatest group group_concat group_id grouping grouping_id groups gtid_subtract guarantee guard handler hash hashkeys having hea head headi headin heading heap help hex hierarchy high high_priority hosts hour hours http id ident_current ident_incr ident_seed identified identity idle_time if ifnull ignore iif ilike ilm immediate import in include including increment index indexes indexing indextype indicator indices inet6_aton inet6_ntoa inet_aton inet_ntoa infile initial initialized initially initrans inmemory inner innodb input insert install instance instantiable instr interface interleaved intersect into invalidate invisible is is_free_lock is_ipv4 is_ipv4_compat is_not is_not_null is_used_lock isdate isnull isolation iterate java join json json_exists keep keep_duplicates key keys kill language large last last_day last_insert_id last_value lateral lax lcase lead leading least leaves left len lenght length less level levels library like like2 like4 likec limit lines link list listagg little ln load load_file lob lobs local localtime localtimestamp locate locator lock locked log log10 log2 logfile logfiles logging logical logical_reads_per_call logoff logon logs long loop low low_priority lower lpad lrtrim ltrim main make_set makedate maketime managed management manual map mapping mask master master_pos_wait match matched materialized max maxextents maximize maxinstances maxlen maxlogfiles maxloghistory maxlogmembers maxsize maxtrans md5 measures median medium member memcompress memory merge microsecond mid migration min minextents minimum mining minus minute minutes minvalue missing mod mode model modification modify module monitoring month months mount move movement multiset mutex name name_const names nan national native natural nav nchar nclob nested never new newline next nextval no no_write_to_binlog noarchivelog noaudit nobadfile nocheck nocompress nocopy nocycle nodelay nodiscardfile noentityescaping noguarantee nokeep nologfile nomapping nomaxvalue nominimize nominvalue nomonitoring none noneditionable nonschema noorder nopr nopro noprom nopromp noprompt norely noresetlogs noreverse normal norowdependencies noschemacheck noswitch not nothing notice notnull notrim novalidate now nowait nth_value nullif nulls num numb numbe nvarchar nvarchar2 object ocicoll ocidate ocidatetime ociduration ociinterval ociloblocator ocinumber ociref ocirefcursor ocirowid ocistring ocitype oct octet_length of off offline offset oid oidindex old on online only opaque open operations operator optimal optimize option optionally or oracle oracle_date oradata ord ordaudio orddicom orddoc order ordimage ordinality ordvideo organization orlany orlvary out outer outfile outline output over overflow overriding package pad parallel parallel_enable parameters parent parse partial partition partitions pascal passing password password_grace_time password_lock_time password_reuse_max password_reuse_time password_verify_function patch path patindex pctincrease pctthreshold pctused pctversion percent percent_rank percentile_cont percentile_disc performance period period_add period_diff permanent physical pi pipe pipelined pivot pluggable plugin policy position post_transaction pow power pragma prebuilt precedes preceding precision prediction prediction_cost prediction_details prediction_probability prediction_set prepare present preserve prior priority private private_sga privileges procedural procedure procedure_analyze processlist profiles project prompt protection public publishingservername purge quarter query quick quiesce quota quotename radians raise rand range rank raw read reads readsize rebuild record records recover recovery recursive recycle redo reduced ref reference referenced references referencing refresh regexp_like register regr_avgx regr_avgy regr_count regr_intercept regr_r2 regr_slope regr_sxx regr_sxy reject rekey relational relative relaylog release release_lock relies_on relocate rely rem remainder rename repair repeat replace replicate replication required reset resetlogs resize resource respect restore restricted result result_cache resumable resume retention return returning returns reuse reverse revoke right rlike role roles rollback rolling rollup round row row_count rowdependencies rowid rownum rows rtrim rules safe salt sample save savepoint sb1 sb2 sb4 scan schema schemacheck scn scope scroll sdo_georaster sdo_topo_geometry search sec_to_time second seconds section securefile security seed segment select self semi sequence sequential serializable server servererror session session_user sessions_per_user set sets settings sha sha1 sha2 share shared shared_pool short show shrink shutdown si_averagecolor si_colorhistogram si_featurelist si_positionalcolor si_stillimage si_texture siblings sid sign sin size size_t sizes skip slave sleep smalldatetimefromparts smallfile snapshot some soname sort soundex source space sparse spfile split sql sql_big_result sql_buffer_result sql_cache sql_calc_found_rows sql_small_result sql_variant_property sqlcode sqldata sqlerror sqlname sqlstate sqrt square standalone standby start starting startup statement static statistics stats_binomial_test stats_crosstab stats_ks_test stats_mode stats_mw_test stats_one_way_anova stats_t_test_ stats_t_test_indep stats_t_test_one stats_t_test_paired stats_wsr_test status std stddev stddev_pop stddev_samp stdev stop storage store stored str str_to_date straight_join strcmp strict string struct stuff style subdate subpartition subpartitions substitutable substr substring subtime subtring_index subtype success sum suspend switch switchoffset switchover sync synchronous synonym sys sys_xmlagg sysasm sysaux sysdate sysdatetimeoffset sysdba sysoper system system_user sysutcdatetime table tables tablespace tablesample tan tdo template temporary terminated tertiary_weights test than then thread through tier ties time time_format time_zone timediff timefromparts timeout timestamp timestampadd timestampdiff timezone_abbr timezone_minute timezone_region to to_base64 to_date to_days to_seconds todatetimeoffset trace tracking transaction transactional translate translation treat trigger trigger_nestlevel triggers trim truncate try_cast try_convert try_parse type ub1 ub2 ub4 ucase unarchived unbounded uncompress under undo unhex unicode uniform uninstall union unique unix_timestamp unknown unlimited unlock unnest unpivot unrecoverable unsafe unsigned until untrusted unusable unused update updated upgrade upped upper upsert url urowid usable usage use use_stored_outlines user user_data user_resources users using utc_date utc_timestamp uuid uuid_short validate validate_password_strength validation valist value values var var_samp varcharc vari varia variab variabl variable variables variance varp varraw varrawc varray verify version versions view virtual visible void wait wallet warning warnings week weekday weekofyear wellformed when whene whenev wheneve whenever where while whitespace window with within without work wrapped xdb xml xmlagg xmlattributes xmlcast xmlcolattval xmlelement xmlexists xmlforest xmlindex xmlnamespaces xmlpi xmlquery xmlroot xmlschema xmlserialize xmltable xmltype xor year year_to_month years yearweek",
                    literal: "true false null unknown",
                    built_in: "array bigint binary bit blob bool boolean char character date dec decimal float int int8 integer interval number numeric real record serial serial8 smallint text time timestamp tinyint varchar varchar2 varying void"
                },
                contains: [{
                    className: "string",
                    begin: "'",
                    end: "'",
                    contains: [{
                        begin: "''"
                    }]
                }, {
                    className: "string",
                    begin: '"',
                    end: '"',
                    contains: [{
                        begin: '""'
                    }]
                }, {
                    className: "string",
                    begin: "`",
                    end: "`"
                }, q.C_NUMBER_MODE, q.C_BLOCK_COMMENT_MODE, K, q.HASH_COMMENT_MODE]
            }, q.C_BLOCK_COMMENT_MODE, K, q.HASH_COMMENT_MODE]
        }
    }
    uU4.exports = SVz
})
// @from(Ln 283532, Col 4)
pU4 = p((now, BU4) => {
    function CVz(q) {
        let K = ["functions", "model", "data", "parameters", "quantities", "transformed", "generated"],
            _ = ["for", "in", "if", "else", "while", "break", "continue", "return"],
            z = ["print", "reject", "increment_log_prob|10", "integrate_ode|10", "integrate_ode_rk45|10", "integrate_ode_bdf|10", "algebra_solver"],
            Y = ["int", "real", "vector", "ordered", "positive_ordered", "simplex", "unit_vector", "row_vector", "matrix", "cholesky_factor_corr|10", "cholesky_factor_cov|10", "corr_matrix|10", "cov_matrix|10", "void"],
            A = ["Phi", "Phi_approx", "abs", "acos", "acosh", "algebra_solver", "append_array", "append_col", "append_row", "asin", "asinh", "atan", "atan2", "atanh", "bernoulli_cdf", "bernoulli_lccdf", "bernoulli_lcdf", "bernoulli_logit_lpmf", "bernoulli_logit_rng", "bernoulli_lpmf", "bernoulli_rng", "bessel_first_kind", "bessel_second_kind", "beta_binomial_cdf", "beta_binomial_lccdf", "beta_binomial_lcdf", "beta_binomial_lpmf", "beta_binomial_rng", "beta_cdf", "beta_lccdf", "beta_lcdf", "beta_lpdf", "beta_rng", "binary_log_loss", "binomial_cdf", "binomial_coefficient_log", "binomial_lccdf", "binomial_lcdf", "binomial_logit_lpmf", "binomial_lpmf", "binomial_rng", "block", "categorical_logit_lpmf", "categorical_logit_rng", "categorical_lpmf", "categorical_rng", "cauchy_cdf", "cauchy_lccdf", "cauchy_lcdf", "cauchy_lpdf", "cauchy_rng", "cbrt", "ceil", "chi_square_cdf", "chi_square_lccdf", "chi_square_lcdf", "chi_square_lpdf", "chi_square_rng", "cholesky_decompose", "choose", "col", "cols", "columns_dot_product", "columns_dot_self", "cos", "cosh", "cov_exp_quad", "crossprod", "csr_extract_u", "csr_extract_v", "csr_extract_w", "csr_matrix_times_vector", "csr_to_dense_matrix", "cumulative_sum", "determinant", "diag_matrix", "diag_post_multiply", "diag_pre_multiply", "diagonal", "digamma", "dims", "dirichlet_lpdf", "dirichlet_rng", "distance", "dot_product", "dot_self", "double_exponential_cdf", "double_exponential_lccdf", "double_exponential_lcdf", "double_exponential_lpdf", "double_exponential_rng", "e", "eigenvalues_sym", "eigenvectors_sym", "erf", "erfc", "exp", "exp2", "exp_mod_normal_cdf", "exp_mod_normal_lccdf", "exp_mod_normal_lcdf", "exp_mod_normal_lpdf", "exp_mod_normal_rng", "expm1", "exponential_cdf", "exponential_lccdf", "exponential_lcdf", "exponential_lpdf", "exponential_rng", "fabs", "falling_factorial", "fdim", "floor", "fma", "fmax", "fmin", "fmod", "frechet_cdf", "frechet_lccdf", "frechet_lcdf", "frechet_lpdf", "frechet_rng", "gamma_cdf", "gamma_lccdf", "gamma_lcdf", "gamma_lpdf", "gamma_p", "gamma_q", "gamma_rng", "gaussian_dlm_obs_lpdf", "get_lp", "gumbel_cdf", "gumbel_lccdf", "gumbel_lcdf", "gumbel_lpdf", "gumbel_rng", "head", "hypergeometric_lpmf", "hypergeometric_rng", "hypot", "inc_beta", "int_step", "integrate_ode", "integrate_ode_bdf", "integrate_ode_rk45", "inv", "inv_Phi", "inv_chi_square_cdf", "inv_chi_square_lccdf", "inv_chi_square_lcdf", "inv_chi_square_lpdf", "inv_chi_square_rng", "inv_cloglog", "inv_gamma_cdf", "inv_gamma_lccdf", "inv_gamma_lcdf", "inv_gamma_lpdf", "inv_gamma_rng", "inv_logit", "inv_sqrt", "inv_square", "inv_wishart_lpdf", "inv_wishart_rng", "inverse", "inverse_spd", "is_inf", "is_nan", "lbeta", "lchoose", "lgamma", "lkj_corr_cholesky_lpdf", "lkj_corr_cholesky_rng", "lkj_corr_lpdf", "lkj_corr_rng", "lmgamma", "lmultiply", "log", "log10", "log1m", "log1m_exp", "log1m_inv_logit", "log1p", "log1p_exp", "log2", "log_determinant", "log_diff_exp", "log_falling_factorial", "log_inv_logit", "log_mix", "log_rising_factorial", "log_softmax", "log_sum_exp", "logistic_cdf", "logistic_lccdf", "logistic_lcdf", "logistic_lpdf", "logistic_rng", "logit", "lognormal_cdf", "lognormal_lccdf", "lognormal_lcdf", "lognormal_lpdf", "lognormal_rng", "machine_precision", "matrix_exp", "max", "mdivide_left_spd", "mdivide_left_tri_low", "mdivide_right_spd", "mdivide_right_tri_low", "mean", "min", "modified_bessel_first_kind", "modified_bessel_second_kind", "multi_gp_cholesky_lpdf", "multi_gp_lpdf", "multi_normal_cholesky_lpdf", "multi_normal_cholesky_rng", "multi_normal_lpdf", "multi_normal_prec_lpdf", "multi_normal_rng", "multi_student_t_lpdf", "multi_student_t_rng", "multinomial_lpmf", "multinomial_rng", "multiply_log", "multiply_lower_tri_self_transpose", "neg_binomial_2_cdf", "neg_binomial_2_lccdf", "neg_binomial_2_lcdf", "neg_binomial_2_log_lpmf", "neg_binomial_2_log_rng", "neg_binomial_2_lpmf", "neg_binomial_2_rng", "neg_binomial_cdf", "neg_binomial_lccdf", "neg_binomial_lcdf", "neg_binomial_lpmf", "neg_binomial_rng", "negative_infinity", "normal_cdf", "normal_lccdf", "normal_lcdf", "normal_lpdf", "normal_rng", "not_a_number", "num_elements", "ordered_logistic_lpmf", "ordered_logistic_rng", "owens_t", "pareto_cdf", "pareto_lccdf", "pareto_lcdf", "pareto_lpdf", "pareto_rng", "pareto_type_2_cdf", "pareto_type_2_lccdf", "pareto_type_2_lcdf", "pareto_type_2_lpdf", "pareto_type_2_rng", "pi", "poisson_cdf", "poisson_lccdf", "poisson_lcdf", "poisson_log_lpmf", "poisson_log_rng", "poisson_lpmf", "poisson_rng", "positive_infinity", "pow", "print", "prod", "qr_Q", "qr_R", "quad_form", "quad_form_diag", "quad_form_sym", "rank", "rayleigh_cdf", "rayleigh_lccdf", "rayleigh_lcdf", "rayleigh_lpdf", "rayleigh_rng", "reject", "rep_array", "rep_matrix", "rep_row_vector", "rep_vector", "rising_factorial", "round", "row", "rows", "rows_dot_product", "rows_dot_self", "scaled_inv_chi_square_cdf", "scaled_inv_chi_square_lccdf", "scaled_inv_chi_square_lcdf", "scaled_inv_chi_square_lpdf", "scaled_inv_chi_square_rng", "sd", "segment", "sin", "singular_values", "sinh", "size", "skew_normal_cdf", "skew_normal_lccdf", "skew_normal_lcdf", "skew_normal_lpdf", "skew_normal_rng", "softmax", "sort_asc", "sort_desc", "sort_indices_asc", "sort_indices_desc", "sqrt", "sqrt2", "square", "squared_distance", "step", "student_t_cdf", "student_t_lccdf", "student_t_lcdf", "student_t_lpdf", "student_t_rng", "sub_col", "sub_row", "sum", "tail", "tan", "tanh", "target", "tcrossprod", "tgamma", "to_array_1d", "to_array_2d", "to_matrix", "to_row_vector", "to_vector", "trace", "trace_gen_quad_form", "trace_quad_form", "trigamma", "trunc", "uniform_cdf", "uniform_lccdf", "uniform_lcdf", "uniform_lpdf", "uniform_rng", "variance", "von_mises_lpdf", "von_mises_rng", "weibull_cdf", "weibull_lccdf", "weibull_lcdf", "weibull_lpdf", "weibull_rng", "wiener_lpdf", "wishart_lpdf", "wishart_rng"],
            O = ["bernoulli", "bernoulli_logit", "beta", "beta_binomial", "binomial", "binomial_logit", "categorical", "categorical_logit", "cauchy", "chi_square", "dirichlet", "double_exponential", "exp_mod_normal", "exponential", "frechet", "gamma", "gaussian_dlm_obs", "gumbel", "hypergeometric", "inv_chi_square", "inv_gamma", "inv_wishart", "lkj_corr", "lkj_corr_cholesky", "logistic", "lognormal", "multi_gp", "multi_gp_cholesky", "multi_normal", "multi_normal_cholesky", "multi_normal_prec", "multi_student_t", "multinomial", "neg_binomial", "neg_binomial_2", "neg_binomial_2_log", "normal", "ordered_logistic", "pareto", "pareto_type_2", "poisson", "poisson_log", "rayleigh", "scaled_inv_chi_square", "skew_normal", "student_t", "uniform", "von_mises", "weibull", "wiener", "wishart"];
        return {
            name: "Stan",
            aliases: ["stanfuncs"],
            keywords: {
                $pattern: q.IDENT_RE,
                title: K,
                keyword: _.concat(Y).concat(z),
                built_in: A
            },
            contains: [q.C_LINE_COMMENT_MODE, q.COMMENT(/#/, /$/, {
                relevance: 0,
                keywords: {
                    "meta-keyword": "include"
                }
            }), q.COMMENT(/\/\*/, /\*\//, {
                relevance: 0,
                contains: [{
                    className: "doctag",
                    begin: /@(return|param)/
                }]
            }), {
                begin: /<\s*lower\s*=/,
                keywords: "lower"
            }, {
                begin: /[<,]\s*upper\s*=/,
                keywords: "upper"
            }, {
                className: "keyword",
                begin: /\btarget\s*\+=/,
                relevance: 10
            }, {
                begin: "~\\s*(" + q.IDENT_RE + ")\\s*\\(",
                keywords: O
            }, {
                className: "number",
                variants: [{
                    begin: /\b\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/
                }, {
                    begin: /\.\d+(?:[eE][+-]?\d+)?\b/
                }],
                relevance: 0
            }, {
                className: "string",
                begin: '"',
                end: '"',
                relevance: 0
            }]
        }
    }
    BU4.exports = CVz
})
// @from(Ln 283591, Col 4)
gU4 = p((iow, FU4) => {
    function bVz(q) {
        return {
            name: "Stata",
            aliases: ["do", "ado"],
            case_insensitive: !0,
            keywords: "if else in foreach for forv forva forval forvalu forvalue forvalues by bys bysort xi quietly qui capture about ac ac_7 acprplot acprplot_7 adjust ado adopath adoupdate alpha ameans an ano anov anova anova_estat anova_terms anovadef aorder ap app appe appen append arch arch_dr arch_estat arch_p archlm areg areg_p args arima arima_dr arima_estat arima_p as asmprobit asmprobit_estat asmprobit_lf asmprobit_mfx__dlg asmprobit_p ass asse asser assert avplot avplot_7 avplots avplots_7 bcskew0 bgodfrey bias binreg bip0_lf biplot bipp_lf bipr_lf bipr_p biprobit bitest bitesti bitowt blogit bmemsize boot bootsamp bootstrap bootstrap_8 boxco_l boxco_p boxcox boxcox_6 boxcox_p bprobit br break brier bro brow brows browse brr brrstat bs bs_7 bsampl_w bsample bsample_7 bsqreg bstat bstat_7 bstat_8 bstrap bstrap_7 bubble bubbleplot ca ca_estat ca_p cabiplot camat canon canon_8 canon_8_p canon_estat canon_p cap caprojection capt captu captur capture cat cc cchart cchart_7 cci cd censobs_table centile cf char chdir checkdlgfiles checkestimationsample checkhlpfiles checksum chelp ci cii cl class classutil clear cli clis clist clo clog clog_lf clog_p clogi clogi_sw clogit clogit_lf clogit_p clogitp clogl_sw cloglog clonevar clslistarray cluster cluster_measures cluster_stop cluster_tree cluster_tree_8 clustermat cmdlog cnr cnre cnreg cnreg_p cnreg_sw cnsreg codebook collaps4 collapse colormult_nb colormult_nw compare compress conf confi confir confirm conren cons const constr constra constrai constrain constraint continue contract copy copyright copysource cor corc corr corr2data corr_anti corr_kmo corr_smc corre correl correla correlat correlate corrgram cou coun count cox cox_p cox_sw coxbase coxhaz coxvar cprplot cprplot_7 crc cret cretu cretur creturn cross cs cscript cscript_log csi ct ct_is ctset ctst_5 ctst_st cttost cumsp cumsp_7 cumul cusum cusum_7 cutil d|0 datasig datasign datasigna datasignat datasignatu datasignatur datasignature datetof db dbeta de dec deco decod decode deff des desc descr descri describ describe destring dfbeta dfgls dfuller di di_g dir dirstats dis discard disp disp_res disp_s displ displa display distinct do doe doed doedi doedit dotplot dotplot_7 dprobit drawnorm drop ds ds_util dstdize duplicates durbina dwstat dydx e|0 ed edi edit egen eivreg emdef en enc enco encod encode eq erase ereg ereg_lf ereg_p ereg_sw ereghet ereghet_glf ereghet_glf_sh ereghet_gp ereghet_ilf ereghet_ilf_sh ereghet_ip eret eretu eretur ereturn err erro error esize est est_cfexist est_cfname est_clickable est_expand est_hold est_table est_unhold est_unholdok estat estat_default estat_summ estat_vce_only esti estimates etodow etof etomdy ex exi exit expand expandcl fac fact facto factor factor_estat factor_p factor_pca_rotated factor_rotate factormat fcast fcast_compute fcast_graph fdades fdadesc fdadescr fdadescri fdadescrib fdadescribe fdasav fdasave fdause fh_st file open file read file close file filefilter fillin find_hlp_file findfile findit findit_7 fit fl fli flis flist for5_0 forest forestplot form forma format fpredict frac_154 frac_adj frac_chk frac_cox frac_ddp frac_dis frac_dv frac_in frac_mun frac_pp frac_pq frac_pv frac_wgt frac_xo fracgen fracplot fracplot_7 fracpoly fracpred fron_ex fron_hn fron_p fron_tn fron_tn2 frontier ftodate ftoe ftomdy ftowdate funnel funnelplot g|0 gamhet_glf gamhet_gp gamhet_ilf gamhet_ip gamma gamma_d2 gamma_p gamma_sw gammahet gdi_hexagon gdi_spokes ge gen gene gener genera generat generate genrank genstd genvmean gettoken gl gladder gladder_7 glim_l01 glim_l02 glim_l03 glim_l04 glim_l05 glim_l06 glim_l07 glim_l08 glim_l09 glim_l10 glim_l11 glim_l12 glim_lf glim_mu glim_nw1 glim_nw2 glim_nw3 glim_p glim_v1 glim_v2 glim_v3 glim_v4 glim_v5 glim_v6 glim_v7 glm glm_6 glm_p glm_sw glmpred glo glob globa global glogit glogit_8 glogit_p gmeans gnbre_lf gnbreg gnbreg_5 gnbreg_p gomp_lf gompe_sw gomper_p gompertz gompertzhet gomphet_glf gomphet_glf_sh gomphet_gp gomphet_ilf gomphet_ilf_sh gomphet_ip gphdot gphpen gphprint gprefs gprobi_p gprobit gprobit_8 gr gr7 gr_copy gr_current gr_db gr_describe gr_dir gr_draw gr_draw_replay gr_drop gr_edit gr_editviewopts gr_example gr_example2 gr_export gr_print gr_qscheme gr_query gr_read gr_rename gr_replay gr_save gr_set gr_setscheme gr_table gr_undo gr_use graph graph7 grebar greigen greigen_7 greigen_8 grmeanby grmeanby_7 gs_fileinfo gs_filetype gs_graphinfo gs_stat gsort gwood h|0 hadimvo hareg hausman haver he heck_d2 heckma_p heckman heckp_lf heckpr_p heckprob hel help hereg hetpr_lf hetpr_p hetprob hettest hexdump hilite hist hist_7 histogram hlogit hlu hmeans hotel hotelling hprobit hreg hsearch icd9 icd9_ff icd9p iis impute imtest inbase include inf infi infil infile infix inp inpu input ins insheet insp inspe inspec inspect integ inten intreg intreg_7 intreg_p intrg2_ll intrg_ll intrg_ll2 ipolate iqreg ir irf irf_create irfm iri is_svy is_svysum isid istdize ivprob_1_lf ivprob_lf ivprobit ivprobit_p ivreg ivreg_footnote ivtob_1_lf ivtob_lf ivtobit ivtobit_p jackknife jacknife jknife jknife_6 jknife_8 jkstat joinby kalarma1 kap kap_3 kapmeier kappa kapwgt kdensity kdensity_7 keep ksm ksmirnov ktau kwallis l|0 la lab labbe labbeplot labe label labelbook ladder levels levelsof leverage lfit lfit_p li lincom line linktest lis list lloghet_glf lloghet_glf_sh lloghet_gp lloghet_ilf lloghet_ilf_sh lloghet_ip llogi_sw llogis_p llogist llogistic llogistichet lnorm_lf lnorm_sw lnorma_p lnormal lnormalhet lnormhet_glf lnormhet_glf_sh lnormhet_gp lnormhet_ilf lnormhet_ilf_sh lnormhet_ip lnskew0 loadingplot loc loca local log logi logis_lf logistic logistic_p logit logit_estat logit_p loglogs logrank loneway lookfor lookup lowess lowess_7 lpredict lrecomp lroc lroc_7 lrtest ls lsens lsens_7 lsens_x lstat ltable ltable_7 ltriang lv lvr2plot lvr2plot_7 m|0 ma mac macr macro makecns man manova manova_estat manova_p manovatest mantel mark markin markout marksample mat mat_capp mat_order mat_put_rr mat_rapp mata mata_clear mata_describe mata_drop mata_matdescribe mata_matsave mata_matuse mata_memory mata_mlib mata_mosave mata_rename mata_which matalabel matcproc matlist matname matr matri matrix matrix_input__dlg matstrik mcc mcci md0_ md1_ md1debug_ md2_ md2debug_ mds mds_estat mds_p mdsconfig mdslong mdsmat mdsshepard mdytoe mdytof me_derd mean means median memory memsize menl meqparse mer merg merge meta mfp mfx mhelp mhodds minbound mixed_ll mixed_ll_reparm mkassert mkdir mkmat mkspline ml ml_5 ml_adjs ml_bhhhs ml_c_d ml_check ml_clear ml_cnt ml_debug ml_defd ml_e0 ml_e0_bfgs ml_e0_cycle ml_e0_dfp ml_e0i ml_e1 ml_e1_bfgs ml_e1_bhhh ml_e1_cycle ml_e1_dfp ml_e2 ml_e2_cycle ml_ebfg0 ml_ebfr0 ml_ebfr1 ml_ebh0q ml_ebhh0 ml_ebhr0 ml_ebr0i ml_ecr0i ml_edfp0 ml_edfr0 ml_edfr1 ml_edr0i ml_eds ml_eer0i ml_egr0i ml_elf ml_elf_bfgs ml_elf_bhhh ml_elf_cycle ml_elf_dfp ml_elfi ml_elfs ml_enr0i ml_enrr0 ml_erdu0 ml_erdu0_bfgs ml_erdu0_bhhh ml_erdu0_bhhhq ml_erdu0_cycle ml_erdu0_dfp ml_erdu0_nrbfgs ml_exde ml_footnote ml_geqnr ml_grad0 ml_graph ml_hbhhh ml_hd0 ml_hold ml_init ml_inv ml_log ml_max ml_mlout ml_mlout_8 ml_model ml_nb0 ml_opt ml_p ml_plot ml_query ml_rdgrd ml_repor ml_s_e ml_score ml_searc ml_technique ml_unhold mleval mlf_ mlmatbysum mlmatsum mlog mlogi mlogit mlogit_footnote mlogit_p mlopts mlsum mlvecsum mnl0_ mor more mov move mprobit mprobit_lf mprobit_p mrdu0_ mrdu1_ mvdecode mvencode mvreg mvreg_estat n|0 nbreg nbreg_al nbreg_lf nbreg_p nbreg_sw nestreg net newey newey_7 newey_p news nl nl_7 nl_9 nl_9_p nl_p nl_p_7 nlcom nlcom_p nlexp2 nlexp2_7 nlexp2a nlexp2a_7 nlexp3 nlexp3_7 nlgom3 nlgom3_7 nlgom4 nlgom4_7 nlinit nllog3 nllog3_7 nllog4 nllog4_7 nlog_rd nlogit nlogit_p nlogitgen nlogittree nlpred no nobreak noi nois noisi noisil noisily note notes notes_dlg nptrend numlabel numlist odbc old_ver olo olog ologi ologi_sw ologit ologit_p ologitp on one onew onewa oneway op_colnm op_comp op_diff op_inv op_str opr opro oprob oprob_sw oprobi oprobi_p oprobit oprobitp opts_exclusive order orthog orthpoly ou out outf outfi outfil outfile outs outsh outshe outshee outsheet ovtest pac pac_7 palette parse parse_dissim pause pca pca_8 pca_display pca_estat pca_p pca_rotate pcamat pchart pchart_7 pchi pchi_7 pcorr pctile pentium pergram pergram_7 permute permute_8 personal peto_st pkcollapse pkcross pkequiv pkexamine pkexamine_7 pkshape pksumm pksumm_7 pl plo plot plugin pnorm pnorm_7 poisgof poiss_lf poiss_sw poisso_p poisson poisson_estat post postclose postfile postutil pperron pr prais prais_e prais_e2 prais_p predict predictnl preserve print pro prob probi probit probit_estat probit_p proc_time procoverlay procrustes procrustes_estat procrustes_p profiler prog progr progra program prop proportion prtest prtesti pwcorr pwd q\\s qby qbys qchi qchi_7 qladder qladder_7 qnorm qnorm_7 qqplot qqplot_7 qreg qreg_c qreg_p qreg_sw qu quadchk quantile quantile_7 que quer query range ranksum ratio rchart rchart_7 rcof recast reclink recode reg reg3 reg3_p regdw regr regre regre_p2 regres regres_p regress regress_estat regriv_p remap ren rena renam rename renpfix repeat replace report reshape restore ret retu retur return rm rmdir robvar roccomp roccomp_7 roccomp_8 rocf_lf rocfit rocfit_8 rocgold rocplot rocplot_7 roctab roctab_7 rolling rologit rologit_p rot rota rotat rotate rotatemat rreg rreg_p ru run runtest rvfplot rvfplot_7 rvpplot rvpplot_7 sa safesum sample sampsi sav save savedresults saveold sc sca scal scala scalar scatter scm_mine sco scob_lf scob_p scobi_sw scobit scor score scoreplot scoreplot_help scree screeplot screeplot_help sdtest sdtesti se search separate seperate serrbar serrbar_7 serset set set_defaults sfrancia sh she shel shell shewhart shewhart_7 signestimationsample signrank signtest simul simul_7 simulate simulate_8 sktest sleep slogit slogit_d2 slogit_p smooth snapspan so sor sort spearman spikeplot spikeplot_7 spikeplt spline_x split sqreg sqreg_p sret sretu sretur sreturn ssc st st_ct st_hc st_hcd st_hcd_sh st_is st_issys st_note st_promo st_set st_show st_smpl st_subid stack statsby statsby_8 stbase stci stci_7 stcox stcox_estat stcox_fr stcox_fr_ll stcox_p stcox_sw stcoxkm stcoxkm_7 stcstat stcurv stcurve stcurve_7 stdes stem stepwise stereg stfill stgen stir stjoin stmc stmh stphplot stphplot_7 stphtest stphtest_7 stptime strate strate_7 streg streg_sw streset sts sts_7 stset stsplit stsum sttocc sttoct stvary stweib su suest suest_8 sum summ summa summar summari summariz summarize sunflower sureg survcurv survsum svar svar_p svmat svy svy_disp svy_dreg svy_est svy_est_7 svy_estat svy_get svy_gnbreg_p svy_head svy_header svy_heckman_p svy_heckprob_p svy_intreg_p svy_ivreg_p svy_logistic_p svy_logit_p svy_mlogit_p svy_nbreg_p svy_ologit_p svy_oprobit_p svy_poisson_p svy_probit_p svy_regress_p svy_sub svy_sub_7 svy_x svy_x_7 svy_x_p svydes svydes_8 svygen svygnbreg svyheckman svyheckprob svyintreg svyintreg_7 svyintrg svyivreg svylc svylog_p svylogit svymarkout svymarkout_8 svymean svymlog svymlogit svynbreg svyolog svyologit svyoprob svyoprobit svyopts svypois svypois_7 svypoisson svyprobit svyprobt svyprop svyprop_7 svyratio svyreg svyreg_p svyregress svyset svyset_7 svyset_8 svytab svytab_7 svytest svytotal sw sw_8 swcnreg swcox swereg swilk swlogis swlogit swologit swoprbt swpois swprobit swqreg swtobit swweib symmetry symmi symplot symplot_7 syntax sysdescribe sysdir sysuse szroeter ta tab tab1 tab2 tab_or tabd tabdi tabdis tabdisp tabi table tabodds tabodds_7 tabstat tabu tabul tabula tabulat tabulate te tempfile tempname tempvar tes test testnl testparm teststd tetrachoric time_it timer tis tob tobi tobit tobit_p tobit_sw token tokeni tokeniz tokenize tostring total translate translator transmap treat_ll treatr_p treatreg trim trimfill trnb_cons trnb_mean trpoiss_d2 trunc_ll truncr_p truncreg tsappend tset tsfill tsline tsline_ex tsreport tsrevar tsrline tsset tssmooth tsunab ttest ttesti tut_chk tut_wait tutorial tw tware_st two twoway twoway__fpfit_serset twoway__function_gen twoway__histogram_gen twoway__ipoint_serset twoway__ipoints_serset twoway__kdensity_gen twoway__lfit_serset twoway__normgen_gen twoway__pci_serset twoway__qfit_serset twoway__scatteri_serset twoway__sunflower_gen twoway_ksm_serset ty typ type typeof u|0 unab unabbrev unabcmd update us use uselabel var var_mkcompanion var_p varbasic varfcast vargranger varirf varirf_add varirf_cgraph varirf_create varirf_ctable varirf_describe varirf_dir varirf_drop varirf_erase varirf_graph varirf_ograph varirf_rename varirf_set varirf_table varlist varlmar varnorm varsoc varstable varstable_w varstable_w2 varwle vce vec vec_fevd vec_mkphi vec_p vec_p_w vecirf_create veclmar veclmar_w vecnorm vecnorm_w vecrank vecstable verinst vers versi versio version view viewsource vif vwls wdatetof webdescribe webseek webuse weib1_lf weib2_lf weib_lf weib_lf0 weibhet_glf weibhet_glf_sh weibhet_glfa weibhet_glfa_sh weibhet_gp weibhet_ilf weibhet_ilf_sh weibhet_ilfa weibhet_ilfa_sh weibhet_ip weibu_sw weibul_p weibull weibull_c weibull_s weibullhet wh whelp whi which whil while wilc_st wilcoxon win wind windo window winexec wntestb wntestb_7 wntestq xchart xchart_7 xcorr xcorr_7 xi xi_6 xmlsav xmlsave xmluse xpose xsh xshe xshel xshell xt_iis xt_tis xtab_p xtabond xtbin_p xtclog xtcloglog xtcloglog_8 xtcloglog_d2 xtcloglog_pa_p xtcloglog_re_p xtcnt_p xtcorr xtdata xtdes xtfront_p xtfrontier xtgee xtgee_elink xtgee_estat xtgee_makeivar xtgee_p xtgee_plink xtgls xtgls_p xthaus xthausman xtht_p xthtaylor xtile xtint_p xtintreg xtintreg_8 xtintreg_d2 xtintreg_p xtivp_1 xtivp_2 xtivreg xtline xtline_ex xtlogit xtlogit_8 xtlogit_d2 xtlogit_fe_p xtlogit_pa_p xtlogit_re_p xtmixed xtmixed_estat xtmixed_p xtnb_fe xtnb_lf xtnbreg xtnbreg_pa_p xtnbreg_refe_p xtpcse xtpcse_p xtpois xtpoisson xtpoisson_d2 xtpoisson_pa_p xtpoisson_refe_p xtpred xtprobit xtprobit_8 xtprobit_d2 xtprobit_re_p xtps_fe xtps_lf xtps_ren xtps_ren_8 xtrar_p xtrc xtrc_p xtrchh xtrefe_p xtreg xtreg_be xtreg_fe xtreg_ml xtreg_pa_p xtreg_re xtregar xtrere_p xtset xtsf_ll xtsf_llti xtsum xttab xttest0 xttobit xttobit_8 xttobit_p xttrans yx yxview__barlike_draw yxview_area_draw yxview_bar_draw yxview_dot_draw yxview_dropline_draw yxview_function_draw yxview_iarrow_draw yxview_ilabels_draw yxview_normal_draw yxview_pcarrow_draw yxview_pcbarrow_draw yxview_pccapsym_draw yxview_pcscatter_draw yxview_pcspike_draw yxview_rarea_draw yxview_rbar_draw yxview_rbarm_draw yxview_rcap_draw yxview_rcapsym_draw yxview_rconnected_draw yxview_rline_draw yxview_rscatter_draw yxview_rspike_draw yxview_spike_draw yxview_sunflower_draw zap_s zinb zinb_llf zinb_plf zip zip_llf zip_p zip_plf zt_ct_5 zt_hc_5 zt_hcd_5 zt_is_5 zt_iss_5 zt_sho_5 zt_smp_5 ztbase_5 ztcox_5 ztdes_5 ztereg_5 ztfill_5 ztgen_5 ztir_5 ztjoin_5 ztnb ztnb_p ztp ztp_p zts_5 ztset_5 ztspli_5 ztsum_5 zttoct_5 ztvary_5 ztweib_5",
            contains: [{
                className: "symbol",
                begin: /`[a-zA-Z0-9_]+'/
            }, {
                className: "variable",
                begin: /\$\{?[a-zA-Z0-9_]+\}?/
            }, {
                className: "string",
                variants: [{
                    begin: `\`"[^\r
]*?"'`
                }, {
                    begin: `"[^\r
"]*"`
                }]
            }, {
                className: "built_in",
                variants: [{
                    begin: "\\b(abs|acos|asin|atan|atan2|atanh|ceil|cloglog|comb|cos|digamma|exp|floor|invcloglog|invlogit|ln|lnfact|lnfactorial|lngamma|log|log10|max|min|mod|reldif|round|sign|sin|sqrt|sum|tan|tanh|trigamma|trunc|betaden|Binomial|binorm|binormal|chi2|chi2tail|dgammapda|dgammapdada|dgammapdadx|dgammapdx|dgammapdxdx|F|Fden|Ftail|gammaden|gammap|ibeta|invbinomial|invchi2|invchi2tail|invF|invFtail|invgammap|invibeta|invnchi2|invnFtail|invnibeta|invnorm|invnormal|invttail|nbetaden|nchi2|nFden|nFtail|nibeta|norm|normal|normalden|normd|npnchi2|tden|ttail|uniform|abbrev|char|index|indexnot|length|lower|ltrim|match|plural|proper|real|regexm|regexr|regexs|reverse|rtrim|string|strlen|strlower|strltrim|strmatch|strofreal|strpos|strproper|strreverse|strrtrim|strtrim|strupper|subinstr|subinword|substr|trim|upper|word|wordcount|_caller|autocode|byteorder|chop|clip|cond|e|epsdouble|epsfloat|group|inlist|inrange|irecode|matrix|maxbyte|maxdouble|maxfloat|maxint|maxlong|mi|minbyte|mindouble|minfloat|minint|minlong|missing|r|recode|replay|return|s|scalar|d|date|day|dow|doy|halfyear|mdy|month|quarter|week|year|d|daily|dofd|dofh|dofm|dofq|dofw|dofy|h|halfyearly|hofd|m|mofd|monthly|q|qofd|quarterly|tin|twithin|w|weekly|wofd|y|yearly|yh|ym|yofd|yq|yw|cholesky|colnumb|colsof|corr|det|diag|diag0cnt|el|get|hadamard|I|inv|invsym|issym|issymmetric|J|matmissing|matuniform|mreldif|nullmat|rownumb|rowsof|sweep|syminv|trace|vec|vecdiag)(?=\\()"
                }]
            }, q.COMMENT("^[ \t]*\\*.*$", !1), q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE]
        }
    }
    FU4.exports = bVz
})
// @from(Ln 283623, Col 4)
QU4 = p((row, UU4) => {
    function IVz(q) {
        return {
            name: "STEP Part 21",
            aliases: ["p21", "step", "stp"],
            case_insensitive: !0,
            keywords: {
                $pattern: "[A-Z_][A-Z0-9_.]*",
                keyword: "HEADER ENDSEC DATA"
            },
            contains: [{
                className: "meta",
                begin: "ISO-10303-21;",
                relevance: 10
            }, {
                className: "meta",
                begin: "END-ISO-10303-21;",
                relevance: 10
            }, q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE, q.COMMENT("/\\*\\*!", "\\*/"), q.C_NUMBER_MODE, q.inherit(q.APOS_STRING_MODE, {
                illegal: null
            }), q.inherit(q.QUOTE_STRING_MODE, {
                illegal: null
            }), {
                className: "string",
                begin: "'",
                end: "'"
            }, {
                className: "symbol",
                variants: [{
                    begin: "#",
                    end: "\\d+",
                    illegal: "\\W"
                }]
            }]
        }
    }
    UU4.exports = IVz
})
// @from(Ln 283661, Col 4)
cU4 = p((oow, dU4) => {
    var xVz = (q) => {
            return {
                IMPORTANT: {
                    className: "meta",
                    begin: "!important"
                },
                HEXCOLOR: {
                    className: "number",
                    begin: "#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})"
                },
                ATTRIBUTE_SELECTOR_MODE: {
                    className: "selector-attr",
                    begin: /\[/,
                    end: /\]/,
                    illegal: "$",
                    contains: [q.APOS_STRING_MODE, q.QUOTE_STRING_MODE]
                }
            }
        },
        uVz = ["a", "abbr", "address", "article", "aside", "audio", "b", "blockquote", "body", "button", "canvas", "caption", "cite", "code", "dd", "del", "details", "dfn", "div", "dl", "dt", "em", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "mark", "menu", "nav", "object", "ol", "p", "q", "quote", "samp", "section", "span", "strong", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "tr", "ul", "var", "video"],
        mVz = ["any-hover", "any-pointer", "aspect-ratio", "color", "color-gamut", "color-index", "device-aspect-ratio", "device-height", "device-width", "display-mode", "forced-colors", "grid", "height", "hover", "inverted-colors", "monochrome", "orientation", "overflow-block", "overflow-inline", "pointer", "prefers-color-scheme", "prefers-contrast", "prefers-reduced-motion", "prefers-reduced-transparency", "resolution", "scan", "scripting", "update", "width", "min-width", "max-width", "min-height", "max-height"],
        BVz = ["active", "any-link", "blank", "checked", "current", "default", "defined", "dir", "disabled", "drop", "empty", "enabled", "first", "first-child", "first-of-type", "fullscreen", "future", "focus", "focus-visible", "focus-within", "has", "host", "host-context", "hover", "indeterminate", "in-range", "invalid", "is", "lang", "last-child", "last-of-type", "left", "link", "local-link", "not", "nth-child", "nth-col", "nth-last-child", "nth-last-col", "nth-last-of-type", "nth-of-type", "only-child", "only-of-type", "optional", "out-of-range", "past", "placeholder-shown", "read-only", "read-write", "required", "right", "root", "scope", "target", "target-within", "user-invalid", "valid", "visited", "where"],
        pVz = ["after", "backdrop", "before", "cue", "cue-region", "first-letter", "first-line", "grammar-error", "marker", "part", "placeholder", "selection", "slotted", "spelling-error"],
        FVz = ["align-content", "align-items", "align-self", "animation", "animation-delay", "animation-direction", "animation-duration", "animation-fill-mode", "animation-iteration-count", "animation-name", "animation-play-state", "animation-timing-function", "auto", "backface-visibility", "background", "background-attachment", "background-clip", "background-color", "background-image", "background-origin", "background-position", "background-repeat", "background-size", "border", "border-bottom", "border-bottom-color", "border-bottom-left-radius", "border-bottom-right-radius", "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-image", "border-image-outset", "border-image-repeat", "border-image-slice", "border-image-source", "border-image-width", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-radius", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-spacing", "border-style", "border-top", "border-top-color", "border-top-left-radius", "border-top-right-radius", "border-top-style", "border-top-width", "border-width", "bottom", "box-decoration-break", "box-shadow", "box-sizing", "break-after", "break-before", "break-inside", "caption-side", "clear", "clip", "clip-path", "color", "column-count", "column-fill", "column-gap", "column-rule", "column-rule-color", "column-rule-style", "column-rule-width", "column-span", "column-width", "columns", "content", "counter-increment", "counter-reset", "cursor", "direction", "display", "empty-cells", "filter", "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap", "float", "font", "font-display", "font-family", "font-feature-settings", "font-kerning", "font-language-override", "font-size", "font-size-adjust", "font-smoothing", "font-stretch", "font-style", "font-variant", "font-variant-ligatures", "font-variation-settings", "font-weight", "height", "hyphens", "icon", "image-orientation", "image-rendering", "image-resolution", "ime-mode", "inherit", "initial", "justify-content", "left", "letter-spacing", "line-height", "list-style", "list-style-image", "list-style-position", "list-style-type", "margin", "margin-bottom", "margin-left", "margin-right", "margin-top", "marks", "mask", "max-height", "max-width", "min-height", "min-width", "nav-down", "nav-index", "nav-left", "nav-right", "nav-up", "none", "normal", "object-fit", "object-position", "opacity", "order", "orphans", "outline", "outline-color", "outline-offset", "outline-style", "outline-width", "overflow", "overflow-wrap", "overflow-x", "overflow-y", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top", "page-break-after", "page-break-before", "page-break-inside", "perspective", "perspective-origin", "pointer-events", "position", "quotes", "resize", "right", "src", "tab-size", "table-layout", "text-align", "text-align-last", "text-decoration", "text-decoration-color", "text-decoration-line", "text-decoration-style", "text-indent", "text-overflow", "text-rendering", "text-shadow", "text-transform", "text-underline-position", "top", "transform", "transform-origin", "transform-style", "transition", "transition-delay", "transition-duration", "transition-property", "transition-timing-function", "unicode-bidi", "vertical-align", "visibility", "white-space", "widows", "width", "word-break", "word-spacing", "word-wrap", "z-index"].reverse();

    function gVz(q) {
        let K = xVz(q),
            _ = "and or not only",
            z = {
                className: "variable",
                begin: "\\$" + q.IDENT_RE
            },
            Y = ["charset", "css", "debug", "extend", "font-face", "for", "import", "include", "keyframes", "media", "mixin", "page", "warn", "while"],
            A = "(?=[.\\s\\n[:,(])";
        return {
            name: "Stylus",
            aliases: ["styl"],
            case_insensitive: !1,
            keywords: "if else for in",
            illegal: "(" + ["\\?", "(\\bReturn\\b)", "(\\bEnd\\b)", "(\\bend\\b)", "(\\bdef\\b)", ";", "#\\s", "\\*\\s", "===\\s", "\\|", "%"].join("|") + ")",
            contains: [q.QUOTE_STRING_MODE, q.APOS_STRING_MODE, q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE, K.HEXCOLOR, {
                begin: "\\.[a-zA-Z][a-zA-Z0-9_-]*(?=[.\\s\\n[:,(])",
                className: "selector-class"
            }, {
                begin: "#[a-zA-Z][a-zA-Z0-9_-]*(?=[.\\s\\n[:,(])",
                className: "selector-id"
            }, {
                begin: "\\b(" + uVz.join("|") + ")(?=[.\\s\\n[:,(])",
                className: "selector-tag"
            }, {
                className: "selector-pseudo",
                begin: "&?:(" + BVz.join("|") + ")(?=[.\\s\\n[:,(])"
            }, {
                className: "selector-pseudo",
                begin: "&?::(" + pVz.join("|") + ")(?=[.\\s\\n[:,(])"
            }, K.ATTRIBUTE_SELECTOR_MODE, {
                className: "keyword",
                begin: /@media/,
                starts: {
                    end: /[{;}]/,
                    keywords: {
                        $pattern: /[a-z-]+/,
                        keyword: "and or not only",
                        attribute: mVz.join(" ")
                    },
                    contains: [q.CSS_NUMBER_MODE]
                }
            }, {
                className: "keyword",
                begin: "@((-(o|moz|ms|webkit)-)?(" + Y.join("|") + "))\\b"
            }, z, q.CSS_NUMBER_MODE, {
                className: "function",
                begin: "^[a-zA-Z][a-zA-Z0-9_-]*\\(.*\\)",
                illegal: "[\\n]",
                returnBegin: !0,
                contains: [{
                    className: "title",
                    begin: "\\b[a-zA-Z][a-zA-Z0-9_-]*"
                }, {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    contains: [K.HEXCOLOR, z, q.APOS_STRING_MODE, q.CSS_NUMBER_MODE, q.QUOTE_STRING_MODE]
                }]
            }, {
                className: "attribute",
                begin: "\\b(" + FVz.join("|") + ")\\b",
                starts: {
                    end: /;|$/,
                    contains: [K.HEXCOLOR, z, q.APOS_STRING_MODE, q.QUOTE_STRING_MODE, q.CSS_NUMBER_MODE, q.C_BLOCK_COMMENT_MODE, K.IMPORTANT],
                    illegal: /\./,
                    relevance: 0
                }
            }]
        }
    }
    dU4.exports = gVz
})
// @from(Ln 283760, Col 4)
nU4 = p((aow, lU4) => {
    function UVz(q) {
        return {
            name: "SubUnit",
            case_insensitive: !0,
            contains: [{
                className: "string",
                begin: `\\[
(multipart)?`,
                end: `\\]
`
            }, {
                className: "string",
                begin: "\\d{4}-\\d{2}-\\d{2}(\\s+)\\d{2}:\\d{2}:\\d{2}.\\d+Z"
            }, {
                className: "string",
                begin: "(\\+|-)\\d+"
            }, {
                className: "keyword",
                relevance: 10,
                variants: [{
                    begin: "^(test|testing|success|successful|failure|error|skip|xfail|uxsuccess)(:?)\\s+(test)?"
                }, {
                    begin: "^progress(:?)(\\s+)?(pop|push)?"
                }, {
                    begin: "^tags:"
                }, {
                    begin: "^time:"
                }]
            }]
        }
    }
    lU4.exports = UVz
})
// @from(Ln 283794, Col 4)
KQ4 = p((sow, qQ4) => {
    function aU4(q) {
        if (!q) return null;
        if (typeof q === "string") return q;
        return q.source
    }

    function NR6(q) {
        return i2("(?=", q, ")")
    }

    function i2(...q) {
        return q.map((_) => aU4(_)).join("")
    }

    function dk(...q) {
        return "(" + q.map((_) => aU4(_)).join("|") + ")"
    }
    var Xo1 = (q) => i2(/\b/, q, /\w$/.test(q) ? /\b/ : /\B/),
        iU4 = ["Protocol", "Type"].map(Xo1),
        $o1 = ["init", "self"].map(Xo1),
        QVz = ["Any", "Self"],
        jo1 = ["associatedtype", "async", "await", /as\?/, /as!/, "as", "break", "case", "catch", "class", "continue", "convenience", "default", "defer", "deinit", "didSet", "do", "dynamic", "else", "enum", "extension", "fallthrough", /fileprivate\(set\)/, "fileprivate", "final", "for", "func", "get", "guard", "if", "import", "indirect", "infix", /init\?/, /init!/, "inout", /internal\(set\)/, "internal", "in", "is", "lazy", "let", "mutating", "nonmutating", /open\(set\)/, "open", "operator", "optional", "override", "postfix", "precedencegroup", "prefix", /private\(set\)/, "private", "protocol", /public\(set\)/, "public", "repeat", "required", "rethrows", "return", "set", "some", "static", "struct", "subscript", "super", "switch", "throws", "throw", /try\?/, /try!/, "try", "typealias", /unowned\(safe\)/, /unowned\(unsafe\)/, "unowned", "var", "weak", "where", "while", "willSet"],
        rU4 = ["false", "nil", "true"],
        dVz = ["assignment", "associativity", "higherThan", "left", "lowerThan", "none", "right"],
        cVz = ["#colorLiteral", "#column", "#dsohandle", "#else", "#elseif", "#endif", "#error", "#file", "#fileID", "#fileLiteral", "#filePath", "#function", "#if", "#imageLiteral", "#keyPath", "#line", "#selector", "#sourceLocation", "#warn_unqualified_access", "#warning"],
        oU4 = ["abs", "all", "any", "assert", "assertionFailure", "debugPrint", "dump", "fatalError", "getVaList", "isKnownUniquelyReferenced", "max", "min", "numericCast", "pointwiseMax", "pointwiseMin", "precondition", "preconditionFailure", "print", "readLine", "repeatElement", "sequence", "stride", "swap", "swift_unboxFromSwiftValueWithType", "transcode", "type", "unsafeBitCast", "unsafeDowncast", "withExtendedLifetime", "withUnsafeMutablePointer", "withUnsafePointer", "withVaList", "withoutActuallyEscaping", "zip"],
        sU4 = dk(/[/=\-+!*%<>&|^~?]/, /[\u00A1-\u00A7]/, /[\u00A9\u00AB]/, /[\u00AC\u00AE]/, /[\u00B0\u00B1]/, /[\u00B6\u00BB\u00BF\u00D7\u00F7]/, /[\u2016-\u2017]/, /[\u2020-\u2027]/, /[\u2030-\u203E]/, /[\u2041-\u2053]/, /[\u2055-\u205E]/, /[\u2190-\u23FF]/, /[\u2500-\u2775]/, /[\u2794-\u2BFF]/, /[\u2E00-\u2E7F]/, /[\u3001-\u3003]/, /[\u3008-\u3020]/, /[\u3030]/),
        tU4 = dk(sU4, /[\u0300-\u036F]/, /[\u1DC0-\u1DFF]/, /[\u20D0-\u20FF]/, /[\uFE00-\uFE0F]/, /[\uFE20-\uFE2F]/),
        Ho1 = i2(sU4, tU4, "*"),
        eU4 = dk(/[a-zA-Z_]/, /[\u00A8\u00AA\u00AD\u00AF\u00B2-\u00B5\u00B7-\u00BA]/, /[\u00BC-\u00BE\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]/, /[\u0100-\u02FF\u0370-\u167F\u1681-\u180D\u180F-\u1DBF]/, /[\u1E00-\u1FFF]/, /[\u200B-\u200D\u202A-\u202E\u203F-\u2040\u2054\u2060-\u206F]/, /[\u2070-\u20CF\u2100-\u218F\u2460-\u24FF\u2776-\u2793]/, /[\u2C00-\u2DFF\u2E80-\u2FFF]/, /[\u3004-\u3007\u3021-\u302F\u3031-\u303F\u3040-\uD7FF]/, /[\uF900-\uFD3D\uFD40-\uFDCF\uFDF0-\uFE1F\uFE30-\uFE44]/, /[\uFE47-\uFEFE\uFF00-\uFFFD]/),
        Ku8 = dk(eU4, /\d/, /[\u0300-\u036F\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]/),
        Ot = i2(eU4, Ku8, "*"),
        Jo1 = i2(/[A-Z]/, Ku8, "*"),
        lVz = ["autoclosure", i2(/convention\(/, dk("swift", "block", "c"), /\)/), "discardableResult", "dynamicCallable", "dynamicMemberLookup", "escaping", "frozen", "GKInspectable", "IBAction", "IBDesignable", "IBInspectable", "IBOutlet", "IBSegueAction", "inlinable", "main", "nonobjc", "NSApplicationMain", "NSCopying", "NSManaged", i2(/objc\(/, Ot, /\)/), "objc", "objcMembers", "propertyWrapper", "requires_stored_property_inits", "testable", "UIApplicationMain", "unknown", "usableFromInline"],
        nVz = ["iOS", "iOSApplicationExtension", "macOS", "macOSApplicationExtension", "macCatalyst", "macCatalystApplicationExtension", "watchOS", "watchOSApplicationExtension", "tvOS", "tvOSApplicationExtension", "swift"];

    function iVz(q) {
        let K = {
                match: /\s+/,
                relevance: 0
            },
            _ = q.COMMENT("/\\*", "\\*/", {
                contains: ["self"]
            }),
            z = [q.C_LINE_COMMENT_MODE, _],
            Y = {
                className: "keyword",
                begin: i2(/\./, NR6(dk(...iU4, ...$o1))),
                end: dk(...iU4, ...$o1),
                excludeBegin: !0
            },
            A = {
                match: i2(/\./, dk(...jo1)),
                relevance: 0
            },
            O = jo1.filter((o) => typeof o === "string").concat(["_|0"]),
            w = jo1.filter((o) => typeof o !== "string").concat(QVz).map(Xo1),
            $ = {
                variants: [{
                    className: "keyword",
                    match: dk(...w, ...$o1)
                }]
            },
            j = {
                $pattern: dk(/\b\w+/, /#\w+/),
                keyword: O.concat(cVz),
                literal: rU4
            },
            H = [Y, A, $],
            J = {
                match: i2(/\./, dk(...oU4)),
                relevance: 0
            },
            X = {
                className: "built_in",
                match: i2(/\b/, dk(...oU4), /(?=\()/)
            },
            M = [J, X],
            P = {
                match: /->/,
                relevance: 0
            },
            W = {
                className: "operator",
                relevance: 0,
                variants: [{
                    match: Ho1
                }, {
                    match: `\\.(\\.|${tU4})+`
                }]
            },
            D = [P, W],
            Z = "([0-9]_*)+",
            G = "([0-9a-fA-F]_*)+",
            f = {
                className: "number",
                relevance: 0,
                variants: [{
                    match: "\\b(([0-9]_*)+)(\\.(([0-9]_*)+))?([eE][+-]?(([0-9]_*)+))?\\b"
                }, {
                    match: "\\b0x(([0-9a-fA-F]_*)+)(\\.(([0-9a-fA-F]_*)+))?([pP][+-]?(([0-9]_*)+))?\\b"
                }, {
                    match: /\b0o([0-7]_*)+\b/
                }, {
                    match: /\b0b([01]_*)+\b/
                }]
            },
            v = (o = "") => ({
                className: "subst",
                variants: [{
                    match: i2(/\\/, o, /[0\\tnr"']/)
                }, {
                    match: i2(/\\/, o, /u\{[0-9a-fA-F]{1,8}\}/)
                }]
            }),
            V = (o = "") => ({
                className: "subst",
                match: i2(/\\/, o, /[\t ]*(?:[\r\n]|\r\n)/)
            }),
            k = (o = "") => ({
                className: "subst",
                label: "interpol",
                begin: i2(/\\/, o, /\(/),
                end: /\)/
            }),
            N = (o = "") => ({
                begin: i2(o, /"""/),
                end: i2(/"""/, o),
                contains: [v(o), V(o), k(o)]
            }),
            R = (o = "") => ({
                begin: i2(o, /"/),
                end: i2(/"/, o),
                contains: [v(o), k(o)]
            }),
            h = {
                className: "string",
                variants: [N(), N("#"), N("##"), N("###"), R(), R("#"), R("##"), R("###")]
            },
            C = {
                match: i2(/`/, Ot, /`/)
            },
            x = {
                className: "variable",
                match: /\$\d+/
            },
            B = {
                className: "variable",
                match: `\\$${Ku8}+`
            },
            m = [C, x, B],
            S = {
                match: /(@|#)available/,
                className: "keyword",
                starts: {
                    contains: [{
                        begin: /\(/,
                        end: /\)/,
                        keywords: nVz,
                        contains: [...D, f, h]
                    }]
                }
            },
            F = {
                className: "keyword",
                match: i2(/@/, dk(...lVz))
            },
            U = {
                className: "meta",
                match: i2(/@/, Ot)
            },
            g = [S, F, U],
            c = {
                match: NR6(/\b[A-Z]/),
                relevance: 0,
                contains: [{
                    className: "type",
                    match: i2(/(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)/, Ku8, "+")
                }, {
                    className: "type",
                    match: Jo1,
                    relevance: 0
                }, {
                    match: /[?!]+/,
                    relevance: 0
                }, {
                    match: /\.\.\./,
                    relevance: 0
                }, {
                    match: i2(/\s+&\s+/, NR6(Jo1)),
                    relevance: 0
                }]
            },
            n = {
                begin: /</,
                end: />/,
                keywords: j,
                contains: [...z, ...H, ...g, P, c]
            };
        c.contains.push(n);
        let l = {
                match: i2(Ot, /\s*:/),
                keywords: "_|0",
                relevance: 0
            },
            z6 = {
                begin: /\(/,
                end: /\)/,
                relevance: 0,
                keywords: j,
                contains: ["self", l, ...z, ...H, ...M, ...D, f, h, ...m, ...g, c]
            },
            A6 = {
                beginKeywords: "func",
                contains: [{
                    className: "title",
                    match: dk(C.match, Ot, Ho1),
                    endsParent: !0,
                    relevance: 0
                }, K]
            },
            e = {
                begin: /</,
                end: />/,
                contains: [...z, c]
            },
            i = {
                begin: dk(NR6(i2(Ot, /\s*:/)), NR6(i2(Ot, /\s+/, Ot, /\s*:/))),
                end: /:/,
                relevance: 0,
                contains: [{
                    className: "keyword",
                    match: /\b_\b/
                }, {
                    className: "params",
                    match: Ot
                }]
            },
            O6 = {
                begin: /\(/,
                end: /\)/,
                keywords: j,
                contains: [i, ...z, ...H, ...D, f, h, ...g, c, z6],
                endsParent: !0,
                illegal: /["']/
            },
            J6 = {
                className: "function",
                match: NR6(/\bfunc\b/),
                contains: [A6, e, O6, K],
                illegal: [/\[/, /%/]
            },
            $6 = {
                className: "function",
                match: /\b(subscript|init[?!]?)\s*(?=[<(])/,
                keywords: {
                    keyword: "subscript init init? init!",
                    $pattern: /\w+[?!]?/
                },
                contains: [e, O6, K],
                illegal: /\[|%/
            },
            H6 = {
                beginKeywords: "operator",
                end: q.MATCH_NOTHING_RE,
                contains: [{
                    className: "title",
                    match: Ho1,
                    endsParent: !0,
                    relevance: 0
                }]
            },
            q6 = {
                beginKeywords: "precedencegroup",
                end: q.MATCH_NOTHING_RE,
                contains: [{
                    className: "title",
                    match: Jo1,
                    relevance: 0
                }, {
                    begin: /{/,
                    end: /}/,
                    relevance: 0,
                    endsParent: !0,
                    keywords: [...dVz, ...rU4],
                    contains: [c]
                }]
            };
        for (let o of h.variants) {
            let _6 = o.contains.find((t) => t.label === "interpol");
            _6.keywords = j;
            let r = [...H, ...M, ...D, f, h, ...m];
            _6.contains = [...r, {
                begin: /\(/,
                end: /\)/,
                contains: ["self", ...r]
            }]
        }
        return {
            name: "Swift",
            keywords: j,
            contains: [...z, J6, $6, {
                className: "class",
                beginKeywords: "struct protocol class extension enum",
                end: "\\{",
                excludeEnd: !0,
                keywords: j,
                contains: [q.inherit(q.TITLE_MODE, {
                    begin: /[A-Za-z$_][\u00C0-\u02B80-9A-Za-z$_]*/
                }), ...H]
            }, H6, q6, {
                beginKeywords: "import",
                end: /$/,
                contains: [...z],
                relevance: 0
            }, ...H, ...M, ...D, f, h, ...m, ...g, c, z6]
        }
    }
    qQ4.exports = iVz
})
// @from(Ln 284115, Col 4)
zQ4 = p((tow, _Q4) => {
    function rVz(q) {
        return {
            name: "Tagger Script",
            contains: [{
                className: "comment",
                begin: /\$noop\(/,
                end: /\)/,
                contains: [{
                    begin: /\(/,
                    end: /\)/,
                    contains: ["self", {
                        begin: /\\./
                    }]
                }],
                relevance: 10
            }, {
                className: "keyword",
                begin: /\$(?!noop)[a-zA-Z][_a-zA-Z0-9]*/,
                end: /\(/,
                excludeEnd: !0
            }, {
                className: "variable",
                begin: /%[_a-zA-Z0-9:]*/,
                end: "%"
            }, {
                className: "symbol",
                begin: /\\./
            }]
        }
    }
    _Q4.exports = rVz
})
// @from(Ln 284148, Col 4)
AQ4 = p((eow, YQ4) => {
    function oVz(q) {
        return {
            name: "Test Anything Protocol",
            case_insensitive: !0,
            contains: [q.HASH_COMMENT_MODE, {
                className: "meta",
                variants: [{
                    begin: "^TAP version (\\d+)$"
                }, {
                    begin: "^1\\.\\.(\\d+)$"
                }]
            }, {
                begin: /---$/,
                end: "\\.\\.\\.$",
                subLanguage: "yaml",
                relevance: 0
            }, {
                className: "number",
                begin: " (\\d+) "
            }, {
                className: "symbol",
                variants: [{
                    begin: "^ok"
                }, {
                    begin: "^not ok"
                }]
            }]
        }
    }
    YQ4.exports = oVz
})
// @from(Ln 284180, Col 4)
$Q4 = p((qaw, wQ4) => {
    function aVz(q) {
        if (!q) return null;
        if (typeof q === "string") return q;
        return q.source
    }

    function sVz(q) {
        return OQ4("(", q, ")?")
    }

    function OQ4(...q) {
        return q.map((_) => aVz(_)).join("")
    }

    function tVz(q) {
        let K = /[a-zA-Z_][a-zA-Z0-9_]*/,
            _ = {
                className: "number",
                variants: [q.BINARY_NUMBER_MODE, q.C_NUMBER_MODE]
            };
        return {
            name: "Tcl",
            aliases: ["tk"],
            keywords: "after append apply array auto_execok auto_import auto_load auto_mkindex auto_mkindex_old auto_qualify auto_reset bgerror binary break catch cd chan clock close concat continue dde dict encoding eof error eval exec exit expr fblocked fconfigure fcopy file fileevent filename flush for foreach format gets glob global history http if incr info interp join lappend|10 lassign|10 lindex|10 linsert|10 list llength|10 load lrange|10 lrepeat|10 lreplace|10 lreverse|10 lsearch|10 lset|10 lsort|10 mathfunc mathop memory msgcat namespace open package parray pid pkg::create pkg_mkIndex platform platform::shell proc puts pwd read refchan regexp registry regsub|10 rename return safe scan seek set socket source split string subst switch tcl_endOfWord tcl_findLibrary tcl_startOfNextWord tcl_startOfPreviousWord tcl_wordBreakAfter tcl_wordBreakBefore tcltest tclvars tell time tm trace unknown unload unset update uplevel upvar variable vwait while",
            contains: [q.COMMENT(";[ \\t]*#", "$"), q.COMMENT("^[ \\t]*#", "$"), {
                beginKeywords: "proc",
                end: "[\\{]",
                excludeEnd: !0,
                contains: [{
                    className: "title",
                    begin: "[ \\t\\n\\r]+(::)?[a-zA-Z_]((::)?[a-zA-Z0-9_])*",
                    end: "[ \\t\\n\\r]",
                    endsWithParent: !0,
                    excludeEnd: !0
                }]
            }, {
                className: "variable",
                variants: [{
                    begin: OQ4(/\$/, sVz(/::/), K, "(::", K, ")*")
                }, {
                    begin: "\\$\\{(::)?[a-zA-Z_]((::)?[a-zA-Z0-9_])*",
                    end: "\\}",
                    contains: [_]
                }]
            }, {
                className: "string",
                contains: [q.BACKSLASH_ESCAPE],
                variants: [q.inherit(q.QUOTE_STRING_MODE, {
                    illegal: null
                })]
            }, _]
        }
    }
    wQ4.exports = tVz
})
// @from(Ln 284236, Col 4)
HQ4 = p((Kaw, jQ4) => {
    function eVz(q) {
        return {
            name: "Thrift",
            keywords: {
                keyword: "namespace const typedef struct enum service exception void oneway set list map required optional",
                built_in: "bool byte i16 i32 i64 double string binary",
                literal: "true false"
            },
            contains: [q.QUOTE_STRING_MODE, q.NUMBER_MODE, q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE, {
                className: "class",
                beginKeywords: "struct enum service exception",
                end: /\{/,
                illegal: /\n/,
                contains: [q.inherit(q.TITLE_MODE, {
                    starts: {
                        endsWithParent: !0,
                        excludeEnd: !0
                    }
                })]
            }, {
                begin: "\\b(set|list|map)\\s*<",
                end: ">",
                keywords: "bool byte i16 i32 i64 double string binary",
                contains: ["self"]
            }]
        }
    }
    jQ4.exports = eVz
})
// @from(Ln 284266, Col 4)
XQ4 = p((_aw, JQ4) => {
    function qkz(q) {
        let K = {
                className: "number",
                begin: "[1-9][0-9]*",
                relevance: 0
            },
            _ = {
                className: "symbol",
                begin: ":[^\\]]+"
            },
            z = {
                className: "built_in",
                begin: "(AR|P|PAYLOAD|PR|R|SR|RSR|LBL|VR|UALM|MESSAGE|UTOOL|UFRAME|TIMER|TIMER_OVERFLOW|JOINT_MAX_SPEED|RESUME_PROG|DIAG_REC)\\[",
                end: "\\]",
                contains: ["self", K, _]
            },
            Y = {
                className: "built_in",
                begin: "(AI|AO|DI|DO|F|RI|RO|UI|UO|GI|GO|SI|SO)\\[",
                end: "\\]",
                contains: ["self", K, q.QUOTE_STRING_MODE, _]
            };
        return {
            name: "TP",
            keywords: {
                keyword: "ABORT ACC ADJUST AND AP_LD BREAK CALL CNT COL CONDITION CONFIG DA DB DIV DETECT ELSE END ENDFOR ERR_NUM ERROR_PROG FINE FOR GP GUARD INC IF JMP LINEAR_MAX_SPEED LOCK MOD MONITOR OFFSET Offset OR OVERRIDE PAUSE PREG PTH RT_LD RUN SELECT SKIP Skip TA TB TO TOOL_OFFSET Tool_Offset UF UT UFRAME_NUM UTOOL_NUM UNLOCK WAIT X Y Z W P R STRLEN SUBSTR FINDSTR VOFFSET PROG ATTR MN POS",
                literal: "ON OFF max_speed LPOS JPOS ENABLE DISABLE START STOP RESET"
            },
            contains: [z, Y, {
                className: "keyword",
                begin: "/(PROG|ATTR|MN|POS|END)\\b"
            }, {
                className: "keyword",
                begin: "(CALL|RUN|POINT_LOGIC|LBL)\\b"
            }, {
                className: "keyword",
                begin: "\\b(ACC|CNT|Skip|Offset|PSPD|RT_LD|AP_LD|Tool_Offset)"
            }, {
                className: "number",
                begin: "\\d+(sec|msec|mm/sec|cm/min|inch/min|deg/sec|mm|in|cm)?\\b",
                relevance: 0
            }, q.COMMENT("//", "[;$]"), q.COMMENT("!", "[;$]"), q.COMMENT("--eg:", "$"), q.QUOTE_STRING_MODE, {
                className: "string",
                begin: "'",
                end: "'"
            }, q.C_NUMBER_MODE, {
                className: "variable",
                begin: "\\$[A-Za-z0-9_]+"
            }]
        }
    }
    JQ4.exports = qkz
})
// @from(Ln 284320, Col 4)
PQ4 = p((zaw, MQ4) => {
    function Kkz(q) {
        var K = {
                className: "params",
                begin: "\\(",
                end: "\\)"
            },
            _ = "attribute block constant cycle date dump include max min parent random range source template_from_string",
            z = {
                beginKeywords: _,
                keywords: {
                    name: _
                },
                relevance: 0,
                contains: [K]
            },
            Y = {
                begin: /\|[A-Za-z_]+:?/,
                keywords: "abs batch capitalize column convert_encoding date date_modify default escape filter first format inky_to_html inline_css join json_encode keys last length lower map markdown merge nl2br number_format raw reduce replace reverse round slice sort spaceless split striptags title trim upper url_encode",
                contains: [z]
            },
            A = "apply autoescape block deprecated do embed extends filter flush for from if import include macro sandbox set use verbatim with";
        return A = A + " " + A.split(" ").map(function(O) {
            return "end" + O
        }).join(" "), {
            name: "Twig",
            aliases: ["craftcms"],
            case_insensitive: !0,
            subLanguage: "xml",
            contains: [q.COMMENT(/\{#/, /#\}/), {
                className: "template-tag",
                begin: /\{%/,
                end: /%\}/,
                contains: [{
                    className: "name",
                    begin: /\w+/,
                    keywords: A,
                    starts: {
                        endsWithParent: !0,
                        contains: [Y, z],
                        relevance: 0
                    }
                }]
            }, {
                className: "template-variable",
                begin: /\{\{/,
                end: /\}\}/,
                contains: ["self", Y, z]
            }]
        }
    }
    MQ4.exports = Kkz
})
// @from(Ln 284373, Col 4)
vQ4 = p((Yaw, GQ4) => {
    var DQ4 = ["as", "in", "of", "if", "for", "while", "finally", "var", "new", "function", "do", "return", "void", "else", "break", "catch", "instanceof", "with", "throw", "case", "default", "try", "switch", "continue", "typeof", "delete", "let", "yield", "const", "class", "debugger", "async", "await", "static", "import", "from", "export", "extends"],
        ZQ4 = ["true", "false", "null", "undefined", "NaN", "Infinity"],
        _kz = ["Intl", "DataView", "Number", "Math", "Date", "String", "RegExp", "Object", "Function", "Boolean", "Error", "Symbol", "Set", "Map", "WeakSet", "WeakMap", "Proxy", "Reflect", "JSON", "Promise", "Float64Array", "Int16Array", "Int32Array", "Int8Array", "Uint16Array", "Uint32Array", "Float32Array", "Array", "Uint8Array", "Uint8ClampedArray", "ArrayBuffer", "BigInt64Array", "BigUint64Array", "BigInt"],
        zkz = ["EvalError", "InternalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"],
        Ykz = ["setInterval", "setTimeout", "clearInterval", "clearTimeout", "require", "exports", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "unescape"],
        Akz = ["arguments", "this", "super", "console", "window", "document", "localStorage", "module", "global"],
        fQ4 = [].concat(Ykz, Akz, _kz, zkz);

    function Okz(q) {
        if (!q) return null;
        if (typeof q === "string") return q;
        return q.source
    }

    function WQ4(q) {
        return Mo1("(?=", q, ")")
    }

    function Mo1(...q) {
        return q.map((_) => Okz(_)).join("")
    }

    function wkz(q) {
        let K = (v, {
                after: V
            }) => {
                let k = "</" + v[0].slice(1);
                return v.input.indexOf(k, V) !== -1
            },
            _ = "[A-Za-z$_][0-9A-Za-z$_]*",
            z = {
                begin: "<>",
                end: "</>"
            },
            Y = {
                begin: /<[A-Za-z0-9\\._:-]+/,
                end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
                isTrulyOpeningTag: (v, V) => {
                    let k = v[0].length + v.index,
                        N = v.input[k];
                    if (N === "<") {
                        V.ignoreMatch();
                        return
                    }
                    if (N === ">") {
                        if (!K(v, {
                                after: k
                            })) V.ignoreMatch()
                    }
                }
            },
            A = {
                $pattern: "[A-Za-z$_][0-9A-Za-z$_]*",
                keyword: DQ4,
                literal: ZQ4,
                built_in: fQ4
            },
            O = "[0-9](_?[0-9])*",
            w = "\\.([0-9](_?[0-9])*)",
            $ = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",
            j = {
                className: "number",
                variants: [{
                    begin: "(\\b(0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*)((\\.([0-9](_?[0-9])*))|\\.)?|(\\.([0-9](_?[0-9])*)))[eE][+-]?([0-9](_?[0-9])*)\\b"
                }, {
                    begin: "\\b(0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*)\\b((\\.([0-9](_?[0-9])*))\\b|\\.)?|(\\.([0-9](_?[0-9])*))\\b"
                }, {
                    begin: "\\b(0|[1-9](_?[0-9])*)n\\b"
                }, {
                    begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"
                }, {
                    begin: "\\b0[bB][0-1](_?[0-1])*n?\\b"
                }, {
                    begin: "\\b0[oO][0-7](_?[0-7])*n?\\b"
                }, {
                    begin: "\\b0[0-7]+n?\\b"
                }],
                relevance: 0
            },
            H = {
                className: "subst",
                begin: "\\$\\{",
                end: "\\}",
                keywords: A,
                contains: []
            },
            J = {
                begin: "html`",
                end: "",
                starts: {
                    end: "`",
                    returnEnd: !1,
                    contains: [q.BACKSLASH_ESCAPE, H],
                    subLanguage: "xml"
                }
            },
            X = {
                begin: "css`",
                end: "",
                starts: {
                    end: "`",
                    returnEnd: !1,
                    contains: [q.BACKSLASH_ESCAPE, H],
                    subLanguage: "css"
                }
            },
            M = {
                className: "string",
                begin: "`",
                end: "`",
                contains: [q.BACKSLASH_ESCAPE, H]
            },
            W = {
                className: "comment",
                variants: [q.COMMENT(/\/\*\*(?!\/)/, "\\*/", {
                    relevance: 0,
                    contains: [{
                        className: "doctag",
                        begin: "@[A-Za-z]+",
                        contains: [{
                            className: "type",
                            begin: "\\{",
                            end: "\\}",
                            relevance: 0
                        }, {
                            className: "variable",
                            begin: "[A-Za-z$_][0-9A-Za-z$_]*(?=\\s*(-)|$)",
                            endsParent: !0,
                            relevance: 0
                        }, {
                            begin: /(?=[^\n])\s/,
                            relevance: 0
                        }]
                    }]
                }), q.C_BLOCK_COMMENT_MODE, q.C_LINE_COMMENT_MODE]
            },
            D = [q.APOS_STRING_MODE, q.QUOTE_STRING_MODE, J, X, M, j, q.REGEXP_MODE];
        H.contains = D.concat({
            begin: /\{/,
            end: /\}/,
            keywords: A,
            contains: ["self"].concat(D)
        });
        let Z = [].concat(W, H.contains),
            G = Z.concat([{
                begin: /\(/,
                end: /\)/,
                keywords: A,
                contains: ["self"].concat(Z)
            }]),
            f = {
                className: "params",
                begin: /\(/,
                end: /\)/,
                excludeBegin: !0,
                excludeEnd: !0,
                keywords: A,
                contains: G
            };
        return {
            name: "Javascript",
            aliases: ["js", "jsx", "mjs", "cjs"],
            keywords: A,
            exports: {
                PARAMS_CONTAINS: G
            },
            illegal: /#(?![$_A-z])/,
            contains: [q.SHEBANG({
                label: "shebang",
                binary: "node",
                relevance: 5
            }), {
                label: "use_strict",
                className: "meta",
                relevance: 10,
                begin: /^\s*['"]use (strict|asm)['"]/
            }, q.APOS_STRING_MODE, q.QUOTE_STRING_MODE, J, X, M, W, j, {
                begin: Mo1(/[{,\n]\s*/, WQ4(Mo1(/(((\/\/.*$)|(\/\*(\*[^/]|[^*])*\*\/))\s*)*/, "[A-Za-z$_][0-9A-Za-z$_]*\\s*:"))),
                relevance: 0,
                contains: [{
                    className: "attr",
                    begin: "[A-Za-z$_][0-9A-Za-z$_]*" + WQ4("\\s*:"),
                    relevance: 0
                }]
            }, {
                begin: "(" + q.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
                keywords: "return throw case",
                contains: [W, q.REGEXP_MODE, {
                    className: "function",
                    begin: "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + q.UNDERSCORE_IDENT_RE + ")\\s*=>",
                    returnBegin: !0,
                    end: "\\s*=>",
                    contains: [{
                        className: "params",
                        variants: [{
                            begin: q.UNDERSCORE_IDENT_RE,
                            relevance: 0
                        }, {
                            className: null,
                            begin: /\(\s*\)/,
                            skip: !0
                        }, {
                            begin: /\(/,
                            end: /\)/,
                            excludeBegin: !0,
                            excludeEnd: !0,
                            keywords: A,
                            contains: G
                        }]
                    }]
                }, {
                    begin: /,/,
                    relevance: 0
                }, {
                    className: "",
                    begin: /\s/,
                    end: /\s*/,
                    skip: !0
                }, {
                    variants: [{
                        begin: z.begin,
                        end: z.end
                    }, {
                        begin: Y.begin,
                        "on:begin": Y.isTrulyOpeningTag,
                        end: Y.end
                    }],
                    subLanguage: "xml",
                    contains: [{
                        begin: Y.begin,
                        end: Y.end,
                        skip: !0,
                        contains: ["self"]
                    }]
                }],
                relevance: 0
            }, {
                className: "function",
                beginKeywords: "function",
                end: /[{;]/,
                excludeEnd: !0,
                keywords: A,
                contains: ["self", q.inherit(q.TITLE_MODE, {
                    begin: "[A-Za-z$_][0-9A-Za-z$_]*"
                }), f],
                illegal: /%/
            }, {
                beginKeywords: "while if switch catch for"
            }, {
                className: "function",
                begin: q.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
                returnBegin: !0,
                contains: [f, q.inherit(q.TITLE_MODE, {
                    begin: "[A-Za-z$_][0-9A-Za-z$_]*"
                })]
            }, {
                variants: [{
                    begin: "\\.[A-Za-z$_][0-9A-Za-z$_]*"
                }, {
                    begin: "\\$[A-Za-z$_][0-9A-Za-z$_]*"
                }],
                relevance: 0
            }, {
                className: "class",
                beginKeywords: "class",
                end: /[{;=]/,
                excludeEnd: !0,
                illegal: /[:"[\]]/,
                contains: [{
                    beginKeywords: "extends"
                }, q.UNDERSCORE_TITLE_MODE]
            }, {
                begin: /\b(?=constructor)/,
                end: /[{;]/,
                excludeEnd: !0,
                contains: [q.inherit(q.TITLE_MODE, {
                    begin: "[A-Za-z$_][0-9A-Za-z$_]*"
                }), "self", f]
            }, {
                begin: "(get|set)\\s+(?=[A-Za-z$_][0-9A-Za-z$_]*\\()",
                end: /\{/,
                keywords: "get set",
                contains: [q.inherit(q.TITLE_MODE, {
                    begin: "[A-Za-z$_][0-9A-Za-z$_]*"
                }), {
                    begin: /\(\)/
                }, f]
            }, {
                begin: /\$[(.]/
            }]
        }
    }

    function $kz(q) {
        let _ = {
                beginKeywords: "namespace",
                end: /\{/,
                excludeEnd: !0
            },
            z = {
                beginKeywords: "interface",
                end: /\{/,
                excludeEnd: !0,
                keywords: "interface extends"
            },
            Y = {
                className: "meta",
                relevance: 10,
                begin: /^\s*['"]use strict['"]/
            },
            A = ["any", "void", "number", "boolean", "string", "object", "never", "enum"],
            O = ["type", "namespace", "typedef", "interface", "public", "private", "protected", "implements", "declare", "abstract", "readonly"],
            w = {
                $pattern: "[A-Za-z$_][0-9A-Za-z$_]*",
                keyword: DQ4.concat(O),
                literal: ZQ4,
                built_in: fQ4.concat(A)
            },
            $ = {
                className: "meta",
                begin: "@[A-Za-z$_][0-9A-Za-z$_]*"
            },
            j = (X, M, P) => {
                let W = X.contains.findIndex((D) => D.label === M);
                if (W === -1) throw Error("can not find mode to replace");
                X.contains.splice(W, 1, P)
            },
            H = wkz(q);
        Object.assign(H.keywords, w), H.exports.PARAMS_CONTAINS.push($), H.contains = H.contains.concat([$, _, z]), j(H, "shebang", q.SHEBANG()), j(H, "use_strict", Y);
        let J = H.contains.find((X) => X.className === "function");
        return J.relevance = 0, Object.assign(H, {
            name: "TypeScript",
            aliases: ["ts", "tsx"]
        }), H
    }
    GQ4.exports = $kz
})
// @from(Ln 284711, Col 4)
VQ4 = p((Aaw, TQ4) => {
    function jkz(q) {
        return {
            name: "Vala",
            keywords: {
                keyword: "char uchar unichar int uint long ulong short ushort int8 int16 int32 int64 uint8 uint16 uint32 uint64 float double bool struct enum string void weak unowned owned async signal static abstract interface override virtual delegate if while do for foreach else switch case break default return try catch public private protected internal using new this get set const stdout stdin stderr var",
                built_in: "DBus GLib CCode Gee Object Gtk Posix",
                literal: "false true null"
            },
            contains: [{
                className: "class",
                beginKeywords: "class interface namespace",
                end: /\{/,
                excludeEnd: !0,
                illegal: "[^,:\\n\\s\\.]",
                contains: [q.UNDERSCORE_TITLE_MODE]
            }, q.C_LINE_COMMENT_MODE, q.C_BLOCK_COMMENT_MODE, {
                className: "string",
                begin: '"""',
                end: '"""',
                relevance: 5
            }, q.APOS_STRING_MODE, q.QUOTE_STRING_MODE, q.C_NUMBER_MODE, {
                className: "meta",
                begin: "^#",
                end: "$",
                relevance: 2
            }]
        }
    }
    TQ4.exports = jkz
})
// @from(Ln 284742, Col 4)
EQ4 = p((Oaw, NQ4) => {
    function kQ4(q) {
        if (!q) return null;
        if (typeof q === "string") return q;
        return q.source
    }

    function _u8(...q) {
        return q.map((_) => kQ4(_)).join("")
    }

    function Po1(...q) {
        return "(" + q.map((_) => kQ4(_)).join("|") + ")"
    }

    function Hkz(q) {
        let K = {
                className: "string",
                begin: /"(""|[^/n])"C\b/
            },
            _ = {
                className: "string",
                begin: /"/,
                end: /"/,
                illegal: /\n/,
                contains: [{
                    begin: /""/
                }]
            },
            z = /\d{1,2}\/\d{1,2}\/\d{4}/,
            Y = /\d{4}-\d{1,2}-\d{1,2}/,
            A = /(\d|1[012])(:\d+){0,2} *(AM|PM)/,
            O = /\d{1,2}(:\d{1,2}){1,2}/,
            w = {
                className: "literal",
                variants: [{
                    begin: _u8(/# */, Po1(Y, z), / *#/)
                }, {
                    begin: _u8(/# */, O, / *#/)
                }, {
                    begin: _u8(/# */, A, / *#/)
                }, {
                    begin: _u8(/# */, Po1(Y, z), / +/, Po1(A, O), / *#/)
                }]
            },
            $ = {
                className: "number",
                relevance: 0,
                variants: [{
                    begin: /\b\d[\d_]*((\.[\d_]+(E[+-]?[\d_]+)?)|(E[+-]?[\d_]+))[RFD@!#]?/
                }, {
                    begin: /\b\d[\d_]*((U?[SIL])|[%&])?/
                }, {
                    begin: /&H[\dA-F_]+((U?[SIL])|[%&])?/
                }, {
                    begin: /&O[0-7_]+((U?[SIL])|[%&])?/
                }, {
                    begin: /&B[01_]+((U?[SIL])|[%&])?/
                }]
            },
            j = {
                className: "label",
                begin: /^\w+:/
            },
            H = q.COMMENT(/'''/, /$/, {
                contains: [{
                    className: "doctag",
                    begin: /<\/?/,
                    end: />/
                }]
            }),
            J = q.COMMENT(null, /$/, {
                variants: [{
                    begin: /'/
                }, {
                    begin: /([\t ]|^)REM(?=\s)/
                }]
            });
        return {
            name: "Visual Basic .NET",
            aliases: ["vb"],
            case_insensitive: !0,
            classNameAliases: {
                label: "symbol"
            },
            keywords: {
                keyword: "addhandler alias aggregate ansi as async assembly auto binary by byref byval call case catch class compare const continue custom declare default delegate dim distinct do each equals else elseif end enum erase error event exit explicit finally for friend from function get global goto group handles if implements imports in inherits interface into iterator join key let lib loop me mid module mustinherit mustoverride mybase myclass namespace narrowing new next notinheritable notoverridable of off on operator option optional order overloads overridable overrides paramarray partial preserve private property protected public raiseevent readonly redim removehandler resume return select set shadows shared skip static step stop structure strict sub synclock take text then throw to try unicode until using when where while widening with withevents writeonly yield",
                built_in: "addressof and andalso await directcast gettype getxmlnamespace is isfalse isnot istrue like mod nameof new not or orelse trycast typeof xor cbool cbyte cchar cdate cdbl cdec cint clng cobj csbyte cshort csng cstr cuint culng cushort",
                type: "boolean byte char date decimal double integer long object sbyte short single string uinteger ulong ushort",
                literal: "true false nothing"
            },
            illegal: "//|\\{|\\}|endif|gosub|variant|wend|^\\$ ",
            contains: [K, _, w, $, j, H, J, {
                className: "meta",
                begin: /[\t ]*#(const|disable|else|elseif|enable|end|externalsource|if|region)\b/,
                end: /$/,
                keywords: {
                    "meta-keyword": "const disable else elseif enable end externalsource if region then"
                },
                contains: [J]
            }]
        }
    }
    NQ4.exports = Hkz
})
// @from(Ln 284847, Col 4)
hQ4 = p((waw, LQ4) => {
    function yQ4(q) {
        if (!q) return null;
        if (typeof q === "string") return q;
        return q.source
    }

    function Jkz(...q) {
        return q.map((_) => yQ4(_)).join("")
    }

    function Xkz(...q) {
        return "(" + q.map((_) => yQ4(_)).join("|") + ")"
    }

    function Mkz(q) {
        let K = "lcase month vartype instrrev ubound setlocale getobject rgb getref string weekdayname rnd dateadd monthname now day minute isarray cbool round formatcurrency conversions csng timevalue second year space abs clng timeserial fixs len asc isempty maths dateserial atn timer isobject filter weekday datevalue ccur isdate instr datediff formatdatetime replace isnull right sgn array snumeric log cdbl hex chr lbound msgbox ucase getlocale cos cdate cbyte rtrim join hour oct typename trim strcomp int createobject loadpicture tan formatnumber mid split  cint sin datepart ltrim sqr time derived eval date formatpercent exp inputbox left ascw chrw regexp cstr err".split(" "),
            _ = ["server", "response", "request", "scriptengine", "scriptenginebuildversion", "scriptengineminorversion", "scriptenginemajorversion"],
            z = {
                begin: Jkz(Xkz(...K), "\\s*\\("),
                relevance: 0,
                keywords: {
                    built_in: K
                }
            };
        return {
            name: "VBScript",
            aliases: ["vbs"],
            case_insensitive: !0,
            keywords: {
                keyword: "call class const dim do loop erase execute executeglobal exit for each next function if then else on error option explicit new private property let get public randomize redim rem select case set stop sub while wend with end to elseif is or xor and not class_initialize class_terminate default preserve in me byval byref step resume goto",
                built_in: _,
                literal: "true false null nothing empty"
            },
            illegal: "//",
            contains: [z, q.inherit(q.QUOTE_STRING_MODE, {
                contains: [{
                    begin: '""'
                }]
            }), q.COMMENT(/'/, /$/, {
                relevance: 0
            }), q.C_NUMBER_MODE]
        }
    }
    LQ4.exports = Mkz
})
// @from(Ln 284893, Col 4)
SQ4 = p(($aw, RQ4) => {
    function Pkz(q) {
        return {
            name: "VBScript in HTML",
            subLanguage: "xml",
            contains: [{
                begin: "<%",
                end: "%>",
                subLanguage: "vbscript"
            }]
        }
    }
    RQ4.exports = Pkz
})