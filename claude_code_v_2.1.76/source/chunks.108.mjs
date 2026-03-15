
// @from(Ln 267434, Col 4)
VX4 = x((M5w, NX4) => {
    function Zr9(A) {
        return {
            name: "Intel x86 Assembly",
            case_insensitive: !0,
            keywords: {
                $pattern: "[.%]?" + A.IDENT_RE,
                keyword: "lock rep repe repz repne repnz xaquire xrelease bnd nobnd aaa aad aam aas adc add and arpl bb0_reset bb1_reset bound bsf bsr bswap bt btc btr bts call cbw cdq cdqe clc cld cli clts cmc cmp cmpsb cmpsd cmpsq cmpsw cmpxchg cmpxchg486 cmpxchg8b cmpxchg16b cpuid cpu_read cpu_write cqo cwd cwde daa das dec div dmint emms enter equ f2xm1 fabs fadd faddp fbld fbstp fchs fclex fcmovb fcmovbe fcmove fcmovnb fcmovnbe fcmovne fcmovnu fcmovu fcom fcomi fcomip fcomp fcompp fcos fdecstp fdisi fdiv fdivp fdivr fdivrp femms feni ffree ffreep fiadd ficom ficomp fidiv fidivr fild fimul fincstp finit fist fistp fisttp fisub fisubr fld fld1 fldcw fldenv fldl2e fldl2t fldlg2 fldln2 fldpi fldz fmul fmulp fnclex fndisi fneni fninit fnop fnsave fnstcw fnstenv fnstsw fpatan fprem fprem1 fptan frndint frstor fsave fscale fsetpm fsin fsincos fsqrt fst fstcw fstenv fstp fstsw fsub fsubp fsubr fsubrp ftst fucom fucomi fucomip fucomp fucompp fxam fxch fxtract fyl2x fyl2xp1 hlt ibts icebp idiv imul in inc incbin insb insd insw int int01 int1 int03 int3 into invd invpcid invlpg invlpga iret iretd iretq iretw jcxz jecxz jrcxz jmp jmpe lahf lar lds lea leave les lfence lfs lgdt lgs lidt lldt lmsw loadall loadall286 lodsb lodsd lodsq lodsw loop loope loopne loopnz loopz lsl lss ltr mfence monitor mov movd movq movsb movsd movsq movsw movsx movsxd movzx mul mwait neg nop not or out outsb outsd outsw packssdw packsswb packuswb paddb paddd paddsb paddsiw paddsw paddusb paddusw paddw pand pandn pause paveb pavgusb pcmpeqb pcmpeqd pcmpeqw pcmpgtb pcmpgtd pcmpgtw pdistib pf2id pfacc pfadd pfcmpeq pfcmpge pfcmpgt pfmax pfmin pfmul pfrcp pfrcpit1 pfrcpit2 pfrsqit1 pfrsqrt pfsub pfsubr pi2fd pmachriw pmaddwd pmagw pmulhriw pmulhrwa pmulhrwc pmulhw pmullw pmvgezb pmvlzb pmvnzb pmvzb pop popa popad popaw popf popfd popfq popfw por prefetch prefetchw pslld psllq psllw psrad psraw psrld psrlq psrlw psubb psubd psubsb psubsiw psubsw psubusb psubusw psubw punpckhbw punpckhdq punpckhwd punpcklbw punpckldq punpcklwd push pusha pushad pushaw pushf pushfd pushfq pushfw pxor rcl rcr rdshr rdmsr rdpmc rdtsc rdtscp ret retf retn rol ror rdm rsdc rsldt rsm rsts sahf sal salc sar sbb scasb scasd scasq scasw sfence sgdt shl shld shr shrd sidt sldt skinit smi smint smintold smsw stc std sti stosb stosd stosq stosw str sub svdc svldt svts swapgs syscall sysenter sysexit sysret test ud0 ud1 ud2b ud2 ud2a umov verr verw fwait wbinvd wrshr wrmsr xadd xbts xchg xlatb xlat xor cmove cmovz cmovne cmovnz cmova cmovnbe cmovae cmovnb cmovb cmovnae cmovbe cmovna cmovg cmovnle cmovge cmovnl cmovl cmovnge cmovle cmovng cmovc cmovnc cmovo cmovno cmovs cmovns cmovp cmovpe cmovnp cmovpo je jz jne jnz ja jnbe jae jnb jb jnae jbe jna jg jnle jge jnl jl jnge jle jng jc jnc jo jno js jns jpo jnp jpe jp sete setz setne setnz seta setnbe setae setnb setnc setb setnae setcset setbe setna setg setnle setge setnl setl setnge setle setng sets setns seto setno setpe setp setpo setnp addps addss andnps andps cmpeqps cmpeqss cmpleps cmpless cmpltps cmpltss cmpneqps cmpneqss cmpnleps cmpnless cmpnltps cmpnltss cmpordps cmpordss cmpunordps cmpunordss cmpps cmpss comiss cvtpi2ps cvtps2pi cvtsi2ss cvtss2si cvttps2pi cvttss2si divps divss ldmxcsr maxps maxss minps minss movaps movhps movlhps movlps movhlps movmskps movntps movss movups mulps mulss orps rcpps rcpss rsqrtps rsqrtss shufps sqrtps sqrtss stmxcsr subps subss ucomiss unpckhps unpcklps xorps fxrstor fxrstor64 fxsave fxsave64 xgetbv xsetbv xsave xsave64 xsaveopt xsaveopt64 xrstor xrstor64 prefetchnta prefetcht0 prefetcht1 prefetcht2 maskmovq movntq pavgb pavgw pextrw pinsrw pmaxsw pmaxub pminsw pminub pmovmskb pmulhuw psadbw pshufw pf2iw pfnacc pfpnacc pi2fw pswapd maskmovdqu clflush movntdq movnti movntpd movdqa movdqu movdq2q movq2dq paddq pmuludq pshufd pshufhw pshuflw pslldq psrldq psubq punpckhqdq punpcklqdq addpd addsd andnpd andpd cmpeqpd cmpeqsd cmplepd cmplesd cmpltpd cmpltsd cmpneqpd cmpneqsd cmpnlepd cmpnlesd cmpnltpd cmpnltsd cmpordpd cmpordsd cmpunordpd cmpunordsd cmppd comisd cvtdq2pd cvtdq2ps cvtpd2dq cvtpd2pi cvtpd2ps cvtpi2pd cvtps2dq cvtps2pd cvtsd2si cvtsd2ss cvtsi2sd cvtss2sd cvttpd2pi cvttpd2dq cvttps2dq cvttsd2si divpd divsd maxpd maxsd minpd minsd movapd movhpd movlpd movmskpd movupd mulpd mulsd orpd shufpd sqrtpd sqrtsd subpd subsd ucomisd unpckhpd unpcklpd xorpd addsubpd addsubps haddpd haddps hsubpd hsubps lddqu movddup movshdup movsldup clgi stgi vmcall vmclear vmfunc vmlaunch vmload vmmcall vmptrld vmptrst vmread vmresume vmrun vmsave vmwrite vmxoff vmxon invept invvpid pabsb pabsw pabsd palignr phaddw phaddd phaddsw phsubw phsubd phsubsw pmaddubsw pmulhrsw pshufb psignb psignw psignd extrq insertq movntsd movntss lzcnt blendpd blendps blendvpd blendvps dppd dpps extractps insertps movntdqa mpsadbw packusdw pblendvb pblendw pcmpeqq pextrb pextrd pextrq phminposuw pinsrb pinsrd pinsrq pmaxsb pmaxsd pmaxud pmaxuw pminsb pminsd pminud pminuw pmovsxbw pmovsxbd pmovsxbq pmovsxwd pmovsxwq pmovsxdq pmovzxbw pmovzxbd pmovzxbq pmovzxwd pmovzxwq pmovzxdq pmuldq pmulld ptest roundpd roundps roundsd roundss crc32 pcmpestri pcmpestrm pcmpistri pcmpistrm pcmpgtq popcnt getsec pfrcpv pfrsqrtv movbe aesenc aesenclast aesdec aesdeclast aesimc aeskeygenassist vaesenc vaesenclast vaesdec vaesdeclast vaesimc vaeskeygenassist vaddpd vaddps vaddsd vaddss vaddsubpd vaddsubps vandpd vandps vandnpd vandnps vblendpd vblendps vblendvpd vblendvps vbroadcastss vbroadcastsd vbroadcastf128 vcmpeq_ospd vcmpeqpd vcmplt_ospd vcmpltpd vcmple_ospd vcmplepd vcmpunord_qpd vcmpunordpd vcmpneq_uqpd vcmpneqpd vcmpnlt_uspd vcmpnltpd vcmpnle_uspd vcmpnlepd vcmpord_qpd vcmpordpd vcmpeq_uqpd vcmpnge_uspd vcmpngepd vcmpngt_uspd vcmpngtpd vcmpfalse_oqpd vcmpfalsepd vcmpneq_oqpd vcmpge_ospd vcmpgepd vcmpgt_ospd vcmpgtpd vcmptrue_uqpd vcmptruepd vcmplt_oqpd vcmple_oqpd vcmpunord_spd vcmpneq_uspd vcmpnlt_uqpd vcmpnle_uqpd vcmpord_spd vcmpeq_uspd vcmpnge_uqpd vcmpngt_uqpd vcmpfalse_ospd vcmpneq_ospd vcmpge_oqpd vcmpgt_oqpd vcmptrue_uspd vcmppd vcmpeq_osps vcmpeqps vcmplt_osps vcmpltps vcmple_osps vcmpleps vcmpunord_qps vcmpunordps vcmpneq_uqps vcmpneqps vcmpnlt_usps vcmpnltps vcmpnle_usps vcmpnleps vcmpord_qps vcmpordps vcmpeq_uqps vcmpnge_usps vcmpngeps vcmpngt_usps vcmpngtps vcmpfalse_oqps vcmpfalseps vcmpneq_oqps vcmpge_osps vcmpgeps vcmpgt_osps vcmpgtps vcmptrue_uqps vcmptrueps vcmplt_oqps vcmple_oqps vcmpunord_sps vcmpneq_usps vcmpnlt_uqps vcmpnle_uqps vcmpord_sps vcmpeq_usps vcmpnge_uqps vcmpngt_uqps vcmpfalse_osps vcmpneq_osps vcmpge_oqps vcmpgt_oqps vcmptrue_usps vcmpps vcmpeq_ossd vcmpeqsd vcmplt_ossd vcmpltsd vcmple_ossd vcmplesd vcmpunord_qsd vcmpunordsd vcmpneq_uqsd vcmpneqsd vcmpnlt_ussd vcmpnltsd vcmpnle_ussd vcmpnlesd vcmpord_qsd vcmpordsd vcmpeq_uqsd vcmpnge_ussd vcmpngesd vcmpngt_ussd vcmpngtsd vcmpfalse_oqsd vcmpfalsesd vcmpneq_oqsd vcmpge_ossd vcmpgesd vcmpgt_ossd vcmpgtsd vcmptrue_uqsd vcmptruesd vcmplt_oqsd vcmple_oqsd vcmpunord_ssd vcmpneq_ussd vcmpnlt_uqsd vcmpnle_uqsd vcmpord_ssd vcmpeq_ussd vcmpnge_uqsd vcmpngt_uqsd vcmpfalse_ossd vcmpneq_ossd vcmpge_oqsd vcmpgt_oqsd vcmptrue_ussd vcmpsd vcmpeq_osss vcmpeqss vcmplt_osss vcmpltss vcmple_osss vcmpless vcmpunord_qss vcmpunordss vcmpneq_uqss vcmpneqss vcmpnlt_usss vcmpnltss vcmpnle_usss vcmpnless vcmpord_qss vcmpordss vcmpeq_uqss vcmpnge_usss vcmpngess vcmpngt_usss vcmpngtss vcmpfalse_oqss vcmpfalsess vcmpneq_oqss vcmpge_osss vcmpgess vcmpgt_osss vcmpgtss vcmptrue_uqss vcmptruess vcmplt_oqss vcmple_oqss vcmpunord_sss vcmpneq_usss vcmpnlt_uqss vcmpnle_uqss vcmpord_sss vcmpeq_usss vcmpnge_uqss vcmpngt_uqss vcmpfalse_osss vcmpneq_osss vcmpge_oqss vcmpgt_oqss vcmptrue_usss vcmpss vcomisd vcomiss vcvtdq2pd vcvtdq2ps vcvtpd2dq vcvtpd2ps vcvtps2dq vcvtps2pd vcvtsd2si vcvtsd2ss vcvtsi2sd vcvtsi2ss vcvtss2sd vcvtss2si vcvttpd2dq vcvttps2dq vcvttsd2si vcvttss2si vdivpd vdivps vdivsd vdivss vdppd vdpps vextractf128 vextractps vhaddpd vhaddps vhsubpd vhsubps vinsertf128 vinsertps vlddqu vldqqu vldmxcsr vmaskmovdqu vmaskmovps vmaskmovpd vmaxpd vmaxps vmaxsd vmaxss vminpd vminps vminsd vminss vmovapd vmovaps vmovd vmovq vmovddup vmovdqa vmovqqa vmovdqu vmovqqu vmovhlps vmovhpd vmovhps vmovlhps vmovlpd vmovlps vmovmskpd vmovmskps vmovntdq vmovntqq vmovntdqa vmovntpd vmovntps vmovsd vmovshdup vmovsldup vmovss vmovupd vmovups vmpsadbw vmulpd vmulps vmulsd vmulss vorpd vorps vpabsb vpabsw vpabsd vpacksswb vpackssdw vpackuswb vpackusdw vpaddb vpaddw vpaddd vpaddq vpaddsb vpaddsw vpaddusb vpaddusw vpalignr vpand vpandn vpavgb vpavgw vpblendvb vpblendw vpcmpestri vpcmpestrm vpcmpistri vpcmpistrm vpcmpeqb vpcmpeqw vpcmpeqd vpcmpeqq vpcmpgtb vpcmpgtw vpcmpgtd vpcmpgtq vpermilpd vpermilps vperm2f128 vpextrb vpextrw vpextrd vpextrq vphaddw vphaddd vphaddsw vphminposuw vphsubw vphsubd vphsubsw vpinsrb vpinsrw vpinsrd vpinsrq vpmaddwd vpmaddubsw vpmaxsb vpmaxsw vpmaxsd vpmaxub vpmaxuw vpmaxud vpminsb vpminsw vpminsd vpminub vpminuw vpminud vpmovmskb vpmovsxbw vpmovsxbd vpmovsxbq vpmovsxwd vpmovsxwq vpmovsxdq vpmovzxbw vpmovzxbd vpmovzxbq vpmovzxwd vpmovzxwq vpmovzxdq vpmulhuw vpmulhrsw vpmulhw vpmullw vpmulld vpmuludq vpmuldq vpor vpsadbw vpshufb vpshufd vpshufhw vpshuflw vpsignb vpsignw vpsignd vpslldq vpsrldq vpsllw vpslld vpsllq vpsraw vpsrad vpsrlw vpsrld vpsrlq vptest vpsubb vpsubw vpsubd vpsubq vpsubsb vpsubsw vpsubusb vpsubusw vpunpckhbw vpunpckhwd vpunpckhdq vpunpckhqdq vpunpcklbw vpunpcklwd vpunpckldq vpunpcklqdq vpxor vrcpps vrcpss vrsqrtps vrsqrtss vroundpd vroundps vroundsd vroundss vshufpd vshufps vsqrtpd vsqrtps vsqrtsd vsqrtss vstmxcsr vsubpd vsubps vsubsd vsubss vtestps vtestpd vucomisd vucomiss vunpckhpd vunpckhps vunpcklpd vunpcklps vxorpd vxorps vzeroall vzeroupper pclmullqlqdq pclmulhqlqdq pclmullqhqdq pclmulhqhqdq pclmulqdq vpclmullqlqdq vpclmulhqlqdq vpclmullqhqdq vpclmulhqhqdq vpclmulqdq vfmadd132ps vfmadd132pd vfmadd312ps vfmadd312pd vfmadd213ps vfmadd213pd vfmadd123ps vfmadd123pd vfmadd231ps vfmadd231pd vfmadd321ps vfmadd321pd vfmaddsub132ps vfmaddsub132pd vfmaddsub312ps vfmaddsub312pd vfmaddsub213ps vfmaddsub213pd vfmaddsub123ps vfmaddsub123pd vfmaddsub231ps vfmaddsub231pd vfmaddsub321ps vfmaddsub321pd vfmsub132ps vfmsub132pd vfmsub312ps vfmsub312pd vfmsub213ps vfmsub213pd vfmsub123ps vfmsub123pd vfmsub231ps vfmsub231pd vfmsub321ps vfmsub321pd vfmsubadd132ps vfmsubadd132pd vfmsubadd312ps vfmsubadd312pd vfmsubadd213ps vfmsubadd213pd vfmsubadd123ps vfmsubadd123pd vfmsubadd231ps vfmsubadd231pd vfmsubadd321ps vfmsubadd321pd vfnmadd132ps vfnmadd132pd vfnmadd312ps vfnmadd312pd vfnmadd213ps vfnmadd213pd vfnmadd123ps vfnmadd123pd vfnmadd231ps vfnmadd231pd vfnmadd321ps vfnmadd321pd vfnmsub132ps vfnmsub132pd vfnmsub312ps vfnmsub312pd vfnmsub213ps vfnmsub213pd vfnmsub123ps vfnmsub123pd vfnmsub231ps vfnmsub231pd vfnmsub321ps vfnmsub321pd vfmadd132ss vfmadd132sd vfmadd312ss vfmadd312sd vfmadd213ss vfmadd213sd vfmadd123ss vfmadd123sd vfmadd231ss vfmadd231sd vfmadd321ss vfmadd321sd vfmsub132ss vfmsub132sd vfmsub312ss vfmsub312sd vfmsub213ss vfmsub213sd vfmsub123ss vfmsub123sd vfmsub231ss vfmsub231sd vfmsub321ss vfmsub321sd vfnmadd132ss vfnmadd132sd vfnmadd312ss vfnmadd312sd vfnmadd213ss vfnmadd213sd vfnmadd123ss vfnmadd123sd vfnmadd231ss vfnmadd231sd vfnmadd321ss vfnmadd321sd vfnmsub132ss vfnmsub132sd vfnmsub312ss vfnmsub312sd vfnmsub213ss vfnmsub213sd vfnmsub123ss vfnmsub123sd vfnmsub231ss vfnmsub231sd vfnmsub321ss vfnmsub321sd rdfsbase rdgsbase rdrand wrfsbase wrgsbase vcvtph2ps vcvtps2ph adcx adox rdseed clac stac xstore xcryptecb xcryptcbc xcryptctr xcryptcfb xcryptofb montmul xsha1 xsha256 llwpcb slwpcb lwpval lwpins vfmaddpd vfmaddps vfmaddsd vfmaddss vfmaddsubpd vfmaddsubps vfmsubaddpd vfmsubaddps vfmsubpd vfmsubps vfmsubsd vfmsubss vfnmaddpd vfnmaddps vfnmaddsd vfnmaddss vfnmsubpd vfnmsubps vfnmsubsd vfnmsubss vfrczpd vfrczps vfrczsd vfrczss vpcmov vpcomb vpcomd vpcomq vpcomub vpcomud vpcomuq vpcomuw vpcomw vphaddbd vphaddbq vphaddbw vphadddq vphaddubd vphaddubq vphaddubw vphaddudq vphadduwd vphadduwq vphaddwd vphaddwq vphsubbw vphsubdq vphsubwd vpmacsdd vpmacsdqh vpmacsdql vpmacssdd vpmacssdqh vpmacssdql vpmacsswd vpmacssww vpmacswd vpmacsww vpmadcsswd vpmadcswd vpperm vprotb vprotd vprotq vprotw vpshab vpshad vpshaq vpshaw vpshlb vpshld vpshlq vpshlw vbroadcasti128 vpblendd vpbroadcastb vpbroadcastw vpbroadcastd vpbroadcastq vpermd vpermpd vpermps vpermq vperm2i128 vextracti128 vinserti128 vpmaskmovd vpmaskmovq vpsllvd vpsllvq vpsravd vpsrlvd vpsrlvq vgatherdpd vgatherqpd vgatherdps vgatherqps vpgatherdd vpgatherqd vpgatherdq vpgatherqq xabort xbegin xend xtest andn bextr blci blcic blsi blsic blcfill blsfill blcmsk blsmsk blsr blcs bzhi mulx pdep pext rorx sarx shlx shrx tzcnt tzmsk t1mskc valignd valignq vblendmpd vblendmps vbroadcastf32x4 vbroadcastf64x4 vbroadcasti32x4 vbroadcasti64x4 vcompresspd vcompressps vcvtpd2udq vcvtps2udq vcvtsd2usi vcvtss2usi vcvttpd2udq vcvttps2udq vcvttsd2usi vcvttss2usi vcvtudq2pd vcvtudq2ps vcvtusi2sd vcvtusi2ss vexpandpd vexpandps vextractf32x4 vextractf64x4 vextracti32x4 vextracti64x4 vfixupimmpd vfixupimmps vfixupimmsd vfixupimmss vgetexppd vgetexpps vgetexpsd vgetexpss vgetmantpd vgetmantps vgetmantsd vgetmantss vinsertf32x4 vinsertf64x4 vinserti32x4 vinserti64x4 vmovdqa32 vmovdqa64 vmovdqu32 vmovdqu64 vpabsq vpandd vpandnd vpandnq vpandq vpblendmd vpblendmq vpcmpltd vpcmpled vpcmpneqd vpcmpnltd vpcmpnled vpcmpd vpcmpltq vpcmpleq vpcmpneqq vpcmpnltq vpcmpnleq vpcmpq vpcmpequd vpcmpltud vpcmpleud vpcmpnequd vpcmpnltud vpcmpnleud vpcmpud vpcmpequq vpcmpltuq vpcmpleuq vpcmpnequq vpcmpnltuq vpcmpnleuq vpcmpuq vpcompressd vpcompressq vpermi2d vpermi2pd vpermi2ps vpermi2q vpermt2d vpermt2pd vpermt2ps vpermt2q vpexpandd vpexpandq vpmaxsq vpmaxuq vpminsq vpminuq vpmovdb vpmovdw vpmovqb vpmovqd vpmovqw vpmovsdb vpmovsdw vpmovsqb vpmovsqd vpmovsqw vpmovusdb vpmovusdw vpmovusqb vpmovusqd vpmovusqw vpord vporq vprold vprolq vprolvd vprolvq vprord vprorq vprorvd vprorvq vpscatterdd vpscatterdq vpscatterqd vpscatterqq vpsraq vpsravq vpternlogd vpternlogq vptestmd vptestmq vptestnmd vptestnmq vpxord vpxorq vrcp14pd vrcp14ps vrcp14sd vrcp14ss vrndscalepd vrndscaleps vrndscalesd vrndscaless vrsqrt14pd vrsqrt14ps vrsqrt14sd vrsqrt14ss vscalefpd vscalefps vscalefsd vscalefss vscatterdpd vscatterdps vscatterqpd vscatterqps vshuff32x4 vshuff64x2 vshufi32x4 vshufi64x2 kandnw kandw kmovw knotw kortestw korw kshiftlw kshiftrw kunpckbw kxnorw kxorw vpbroadcastmb2q vpbroadcastmw2d vpconflictd vpconflictq vplzcntd vplzcntq vexp2pd vexp2ps vrcp28pd vrcp28ps vrcp28sd vrcp28ss vrsqrt28pd vrsqrt28ps vrsqrt28sd vrsqrt28ss vgatherpf0dpd vgatherpf0dps vgatherpf0qpd vgatherpf0qps vgatherpf1dpd vgatherpf1dps vgatherpf1qpd vgatherpf1qps vscatterpf0dpd vscatterpf0dps vscatterpf0qpd vscatterpf0qps vscatterpf1dpd vscatterpf1dps vscatterpf1qpd vscatterpf1qps prefetchwt1 bndmk bndcl bndcu bndcn bndmov bndldx bndstx sha1rnds4 sha1nexte sha1msg1 sha1msg2 sha256rnds2 sha256msg1 sha256msg2 hint_nop0 hint_nop1 hint_nop2 hint_nop3 hint_nop4 hint_nop5 hint_nop6 hint_nop7 hint_nop8 hint_nop9 hint_nop10 hint_nop11 hint_nop12 hint_nop13 hint_nop14 hint_nop15 hint_nop16 hint_nop17 hint_nop18 hint_nop19 hint_nop20 hint_nop21 hint_nop22 hint_nop23 hint_nop24 hint_nop25 hint_nop26 hint_nop27 hint_nop28 hint_nop29 hint_nop30 hint_nop31 hint_nop32 hint_nop33 hint_nop34 hint_nop35 hint_nop36 hint_nop37 hint_nop38 hint_nop39 hint_nop40 hint_nop41 hint_nop42 hint_nop43 hint_nop44 hint_nop45 hint_nop46 hint_nop47 hint_nop48 hint_nop49 hint_nop50 hint_nop51 hint_nop52 hint_nop53 hint_nop54 hint_nop55 hint_nop56 hint_nop57 hint_nop58 hint_nop59 hint_nop60 hint_nop61 hint_nop62 hint_nop63",
                built_in: "ip eip rip al ah bl bh cl ch dl dh sil dil bpl spl r8b r9b r10b r11b r12b r13b r14b r15b ax bx cx dx si di bp sp r8w r9w r10w r11w r12w r13w r14w r15w eax ebx ecx edx esi edi ebp esp eip r8d r9d r10d r11d r12d r13d r14d r15d rax rbx rcx rdx rsi rdi rbp rsp r8 r9 r10 r11 r12 r13 r14 r15 cs ds es fs gs ss st st0 st1 st2 st3 st4 st5 st6 st7 mm0 mm1 mm2 mm3 mm4 mm5 mm6 mm7 xmm0  xmm1  xmm2  xmm3  xmm4  xmm5  xmm6  xmm7  xmm8  xmm9 xmm10  xmm11 xmm12 xmm13 xmm14 xmm15 xmm16 xmm17 xmm18 xmm19 xmm20 xmm21 xmm22 xmm23 xmm24 xmm25 xmm26 xmm27 xmm28 xmm29 xmm30 xmm31 ymm0  ymm1  ymm2  ymm3  ymm4  ymm5  ymm6  ymm7  ymm8  ymm9 ymm10  ymm11 ymm12 ymm13 ymm14 ymm15 ymm16 ymm17 ymm18 ymm19 ymm20 ymm21 ymm22 ymm23 ymm24 ymm25 ymm26 ymm27 ymm28 ymm29 ymm30 ymm31 zmm0  zmm1  zmm2  zmm3  zmm4  zmm5  zmm6  zmm7  zmm8  zmm9 zmm10  zmm11 zmm12 zmm13 zmm14 zmm15 zmm16 zmm17 zmm18 zmm19 zmm20 zmm21 zmm22 zmm23 zmm24 zmm25 zmm26 zmm27 zmm28 zmm29 zmm30 zmm31 k0 k1 k2 k3 k4 k5 k6 k7 bnd0 bnd1 bnd2 bnd3 cr0 cr1 cr2 cr3 cr4 cr8 dr0 dr1 dr2 dr3 dr8 tr3 tr4 tr5 tr6 tr7 r0 r1 r2 r3 r4 r5 r6 r7 r0b r1b r2b r3b r4b r5b r6b r7b r0w r1w r2w r3w r4w r5w r6w r7w r0d r1d r2d r3d r4d r5d r6d r7d r0h r1h r2h r3h r0l r1l r2l r3l r4l r5l r6l r7l r8l r9l r10l r11l r12l r13l r14l r15l db dw dd dq dt ddq do dy dz resb resw resd resq rest resdq reso resy resz incbin equ times byte word dword qword nosplit rel abs seg wrt strict near far a32 ptr",
                meta: "%define %xdefine %+ %undef %defstr %deftok %assign %strcat %strlen %substr %rotate %elif %else %endif %if %ifmacro %ifctx %ifidn %ifidni %ifid %ifnum %ifstr %iftoken %ifempty %ifenv %error %warning %fatal %rep %endrep %include %push %pop %repl %pathsearch %depend %use %arg %stacksize %local %line %comment %endcomment .nolist __FILE__ __LINE__ __SECT__  __BITS__ __OUTPUT_FORMAT__ __DATE__ __TIME__ __DATE_NUM__ __TIME_NUM__ __UTC_DATE__ __UTC_TIME__ __UTC_DATE_NUM__ __UTC_TIME_NUM__  __PASS__ struc endstruc istruc at iend align alignb sectalign daz nodaz up down zero default option assume public bits use16 use32 use64 default section segment absolute extern global common cpu float __utf16__ __utf16le__ __utf16be__ __utf32__ __utf32le__ __utf32be__ __float8__ __float16__ __float32__ __float64__ __float80m__ __float80e__ __float128l__ __float128h__ __Infinity__ __QNaN__ __SNaN__ Inf NaN QNaN SNaN float8 float16 float32 float64 float80m float80e float128l float128h __FLOAT_DAZ__ __FLOAT_ROUND__ __FLOAT__"
            },
            contains: [A.COMMENT(";", "$", {
                relevance: 0
            }), {
                className: "number",
                variants: [{
                    begin: "\\b(?:([0-9][0-9_]*)?\\.[0-9_]*(?:[eE][+-]?[0-9_]+)?|(0[Xx])?[0-9][0-9_]*(\\.[0-9_]*)?(?:[pP](?:[+-]?[0-9_]+)?)?)\\b",
                    relevance: 0
                }, {
                    begin: "\\$[0-9][0-9A-Fa-f]*",
                    relevance: 0
                }, {
                    begin: "\\b(?:[0-9A-Fa-f][0-9A-Fa-f_]*[Hh]|[0-9][0-9_]*[DdTt]?|[0-7][0-7_]*[QqOo]|[0-1][0-1_]*[BbYy])\\b"
                }, {
                    begin: "\\b(?:0[Xx][0-9A-Fa-f_]+|0[DdTt][0-9_]+|0[QqOo][0-7_]+|0[BbYy][0-1_]+)\\b"
                }]
            }, A.QUOTE_STRING_MODE, {
                className: "string",
                variants: [{
                    begin: "'",
                    end: "[^\\\\]'"
                }, {
                    begin: "`",
                    end: "[^\\\\]`"
                }],
                relevance: 0
            }, {
                className: "symbol",
                variants: [{
                    begin: "^\\s*[A-Za-z._?][A-Za-z0-9_$#@~.?]*(:|\\s+label)"
                }, {
                    begin: "^\\s*%%[A-Za-z0-9_$#@~.?]*:"
                }],
                relevance: 0
            }, {
                className: "subst",
                begin: "%[0-9]+",
                relevance: 0
            }, {
                className: "subst",
                begin: "%!S+",
                relevance: 0
            }, {
                className: "meta",
                begin: /^\s*\.[\w_-]+/
            }]
        }
    }
    NX4.exports = Zr9
})
// @from(Ln 267494, Col 4)
EX4 = x((D5w, kX4) => {
    function Gr9(A) {
        let K = {
                $pattern: /[a-zA-Z][a-zA-Z0-9_?]*/,
                keyword: "if then else do while until for loop import with is as where when by data constant integer real text name boolean symbol infix prefix postfix block tree",
                literal: "true false nil",
                built_in: "in mod rem and or xor not abs sign floor ceil sqrt sin cos tan asin acos atan exp expm1 log log2 log10 log1p pi at text_length text_range text_find text_replace contains page slide basic_slide title_slide title subtitle fade_in fade_out fade_at clear_color color line_color line_width texture_wrap texture_transform texture scale_?x scale_?y scale_?z? translate_?x translate_?y translate_?z? rotate_?x rotate_?y rotate_?z? rectangle circle ellipse sphere path line_to move_to quad_to curve_to theme background contents locally time mouse_?x mouse_?y mouse_buttons " + "ObjectLoader Animate MovieCredits Slides Filters Shading Materials LensFlare Mapping VLCAudioVideo StereoDecoder PointCloud NetworkAccess RemoteControl RegExp ChromaKey Snowfall NodeJS Speech Charts"
            },
            Y = {
                className: "string",
                begin: '"',
                end: '"',
                illegal: "\\n"
            },
            z = {
                className: "string",
                begin: "'",
                end: "'",
                illegal: "\\n"
            },
            _ = {
                className: "string",
                begin: "<<",
                end: ">>"
            },
            w = {
                className: "number",
                begin: "[0-9]+#[0-9A-Z_]+(\\.[0-9-A-Z_]+)?#?([Ee][+-]?[0-9]+)?"
            },
            O = {
                beginKeywords: "import",
                end: "$",
                keywords: K,
                contains: [Y]
            },
            $ = {
                className: "function",
                begin: /[a-z][^\n]*->/,
                returnBegin: !0,
                end: /->/,
                contains: [A.inherit(A.TITLE_MODE, {
                    starts: {
                        endsWithParent: !0,
                        keywords: K
                    }
                })]
            };
        return {
            name: "XL",
            aliases: ["tao"],
            keywords: K,
            contains: [A.C_LINE_COMMENT_MODE, A.C_BLOCK_COMMENT_MODE, Y, z, _, $, O, w, A.NUMBER_MODE]
        }
    }
    kX4.exports = Gr9
})
// @from(Ln 267550, Col 4)
LX4 = x((X5w, yX4) => {
    function fr9(A) {
        return {
            name: "XQuery",
            aliases: ["xpath", "xq"],
            case_insensitive: !1,
            illegal: /(proc)|(abstract)|(extends)|(until)|(#)/,
            keywords: {
                $pattern: /[a-zA-Z$][a-zA-Z0-9_:-]*/,
                keyword: "module schema namespace boundary-space preserve no-preserve strip default collation base-uri ordering context decimal-format decimal-separator copy-namespaces empty-sequence except exponent-separator external grouping-separator inherit no-inherit lax minus-sign per-mille percent schema-attribute schema-element strict unordered zero-digit declare import option function validate variable for at in let where order group by return if then else tumbling sliding window start when only end previous next stable ascending descending allowing empty greatest least some every satisfies switch case typeswitch try catch and or to union intersect instance of treat as castable cast map array delete insert into replace value rename copy modify update",
                type: "item document-node node attribute document element comment namespace namespace-node processing-instruction text construction xs:anyAtomicType xs:untypedAtomic xs:duration xs:time xs:decimal xs:float xs:double xs:gYearMonth xs:gYear xs:gMonthDay xs:gMonth xs:gDay xs:boolean xs:base64Binary xs:hexBinary xs:anyURI xs:QName xs:NOTATION xs:dateTime xs:dateTimeStamp xs:date xs:string xs:normalizedString xs:token xs:language xs:NMTOKEN xs:Name xs:NCName xs:ID xs:IDREF xs:ENTITY xs:integer xs:nonPositiveInteger xs:negativeInteger xs:long xs:int xs:short xs:byte xs:nonNegativeInteger xs:unisignedLong xs:unsignedInt xs:unsignedShort xs:unsignedByte xs:positiveInteger xs:yearMonthDuration xs:dayTimeDuration",
                literal: "eq ne lt le gt ge is self:: child:: descendant:: descendant-or-self:: attribute:: following:: following-sibling:: parent:: ancestor:: ancestor-or-self:: preceding:: preceding-sibling:: NaN"
            },
            contains: [{
                className: "variable",
                begin: /[$][\w\-:]+/
            }, {
                className: "built_in",
                variants: [{
                    begin: /\barray:/,
                    end: /(?:append|filter|flatten|fold-(?:left|right)|for-each(?:-pair)?|get|head|insert-before|join|put|remove|reverse|size|sort|subarray|tail)\b/
                }, {
                    begin: /\bmap:/,
                    end: /(?:contains|entry|find|for-each|get|keys|merge|put|remove|size)\b/
                }, {
                    begin: /\bmath:/,
                    end: /(?:a(?:cos|sin|tan[2]?)|cos|exp(?:10)?|log(?:10)?|pi|pow|sin|sqrt|tan)\b/
                }, {
                    begin: /\bop:/,
                    end: /\(/,
                    excludeEnd: !0
                }, {
                    begin: /\bfn:/,
                    end: /\(/,
                    excludeEnd: !0
                }, {
                    begin: /[^</$:'"-]\b(?:abs|accumulator-(?:after|before)|adjust-(?:date(?:Time)?|time)-to-timezone|analyze-string|apply|available-(?:environment-variables|system-properties)|avg|base-uri|boolean|ceiling|codepoints?-(?:equal|to-string)|collation-key|collection|compare|concat|contains(?:-token)?|copy-of|count|current(?:-)?(?:date(?:Time)?|time|group(?:ing-key)?|output-uri|merge-(?:group|key))?data|dateTime|days?-from-(?:date(?:Time)?|duration)|deep-equal|default-(?:collation|language)|distinct-values|document(?:-uri)?|doc(?:-available)?|element-(?:available|with-id)|empty|encode-for-uri|ends-with|environment-variable|error|escape-html-uri|exactly-one|exists|false|filter|floor|fold-(?:left|right)|for-each(?:-pair)?|format-(?:date(?:Time)?|time|integer|number)|function-(?:arity|available|lookup|name)|generate-id|has-children|head|hours-from-(?:dateTime|duration|time)|id(?:ref)?|implicit-timezone|in-scope-prefixes|index-of|innermost|insert-before|iri-to-uri|json-(?:doc|to-xml)|key|lang|last|load-xquery-module|local-name(?:-from-QName)?|(?:lower|upper)-case|matches|max|minutes-from-(?:dateTime|duration|time)|min|months?-from-(?:date(?:Time)?|duration)|name(?:space-uri-?(?:for-prefix|from-QName)?)?|nilled|node-name|normalize-(?:space|unicode)|not|number|one-or-more|outermost|parse-(?:ietf-date|json)|path|position|(?:prefix-from-)?QName|random-number-generator|regex-group|remove|replace|resolve-(?:QName|uri)|reverse|root|round(?:-half-to-even)?|seconds-from-(?:dateTime|duration|time)|snapshot|sort|starts-with|static-base-uri|stream-available|string-?(?:join|length|to-codepoints)?|subsequence|substring-?(?:after|before)?|sum|system-property|tail|timezone-from-(?:date(?:Time)?|time)|tokenize|trace|trans(?:form|late)|true|type-available|unordered|unparsed-(?:entity|text)?-?(?:public-id|uri|available|lines)?|uri-collection|xml-to-json|years?-from-(?:date(?:Time)?|duration)|zero-or-one)\b/
                }, {
                    begin: /\blocal:/,
                    end: /\(/,
                    excludeEnd: !0
                }, {
                    begin: /\bzip:/,
                    end: /(?:zip-file|(?:xml|html|text|binary)-entry| (?:update-)?entries)\b/
                }, {
                    begin: /\b(?:util|db|functx|app|xdmp|xmldb):/,
                    end: /\(/,
                    excludeEnd: !0
                }]
            }, {
                className: "string",
                variants: [{
                    begin: /"/,
                    end: /"/,
                    contains: [{
                        begin: /""/,
                        relevance: 0
                    }]
                }, {
                    begin: /'/,
                    end: /'/,
                    contains: [{
                        begin: /''/,
                        relevance: 0
                    }]
                }]
            }, {
                className: "number",
                begin: /(\b0[0-7_]+)|(\b0x[0-9a-fA-F_]+)|(\b[1-9][0-9_]*(\.[0-9_]+)?)|[0_]\b/,
                relevance: 0
            }, {
                className: "comment",
                begin: /\(:/,
                end: /:\)/,
                relevance: 10,
                contains: [{
                    className: "doctag",
                    begin: /@\w+/
                }]
            }, {
                className: "meta",
                begin: /%[\w\-:]+/
            }, {
                className: "title",
                begin: /\bxquery version "[13]\.[01]"\s?(?:encoding ".+")?/,
                end: /;/
            }, {
                beginKeywords: "element attribute comment document processing-instruction",
                end: /\{/,
                excludeEnd: !0
            }, {
                begin: /<([\w._:-]+)(\s+\S*=('|").*('|"))?>/,
                end: /(\/[\w._:-]+>)/,
                subLanguage: "xml",
                contains: [{
                    begin: /\{/,
                    end: /\}/,
                    subLanguage: "xquery"
                }, "self"]
            }]
        }
    }
    yX4.exports = fr9
})
// @from(Ln 267654, Col 4)
hX4 = x((P5w, RX4) => {
    function Tr9(A) {
        let q = {
                className: "string",
                contains: [A.BACKSLASH_ESCAPE],
                variants: [A.inherit(A.APOS_STRING_MODE, {
                    illegal: null
                }), A.inherit(A.QUOTE_STRING_MODE, {
                    illegal: null
                })]
            },
            K = A.UNDERSCORE_TITLE_MODE,
            Y = {
                variants: [A.BINARY_NUMBER_MODE, A.C_NUMBER_MODE]
            },
            z = "namespace class interface use extends function return abstract final public protected private static deprecated throw try catch Exception echo empty isset instanceof unset let var new const self require if else elseif switch case default do while loop for continue break likely unlikely __LINE__ __FILE__ __DIR__ __FUNCTION__ __CLASS__ __TRAIT__ __METHOD__ __NAMESPACE__ array boolean float double integer object resource string char long unsigned bool int uint ulong uchar true false null undefined";
        return {
            name: "Zephir",
            aliases: ["zep"],
            keywords: z,
            contains: [A.C_LINE_COMMENT_MODE, A.COMMENT(/\/\*/, /\*\//, {
                contains: [{
                    className: "doctag",
                    begin: /@[A-Za-z]+/
                }]
            }), {
                className: "string",
                begin: /<<<['"]?\w+['"]?$/,
                end: /^\w+;/,
                contains: [A.BACKSLASH_ESCAPE]
            }, {
                begin: /(::|->)+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/
            }, {
                className: "function",
                beginKeywords: "function fn",
                end: /[;{]/,
                excludeEnd: !0,
                illegal: /\$|\[|%/,
                contains: [K, {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    keywords: z,
                    contains: ["self", A.C_BLOCK_COMMENT_MODE, q, Y]
                }]
            }, {
                className: "class",
                beginKeywords: "class interface",
                end: /\{/,
                excludeEnd: !0,
                illegal: /[:($"]/,
                contains: [{
                    beginKeywords: "extends implements"
                }, K]
            }, {
                beginKeywords: "namespace",
                end: /;/,
                illegal: /[.']/,
                contains: [K]
            }, {
                beginKeywords: "use",
                end: /;/,
                contains: [K]
            }, {
                begin: /=>/
            }, q, Y]
        }
    }
    RX4.exports = Tr9
})
// @from(Ln 267724, Col 4)
rE8 = x((W5w, SX4) => {
    var r1 = cw4();
    r1.registerLanguage("1c", iw4());
    r1.registerLanguage("abnf", rw4());
    r1.registerLanguage("accesslog", sw4());
    r1.registerLanguage("actionscript", ew4());
    r1.registerLanguage("ada", qO4());
    r1.registerLanguage("angelscript", YO4());
    r1.registerLanguage("apache", _O4());
    r1.registerLanguage("applescript", jO4());
    r1.registerLanguage("arcade", MO4());
    r1.registerLanguage("arduino", XO4());
    r1.registerLanguage("armasm", WO4());
    r1.registerLanguage("xml", TO4());
    r1.registerLanguage("asciidoc", VO4());
    r1.registerLanguage("aspectj", EO4());
    r1.registerLanguage("autohotkey", LO4());
    r1.registerLanguage("autoit", hO4());
    r1.registerLanguage("avrasm", CO4());
    r1.registerLanguage("awk", bO4());
    r1.registerLanguage("axapta", uO4());
    r1.registerLanguage("bash", BO4());
    r1.registerLanguage("basic", FO4());
    r1.registerLanguage("bnf", QO4());
    r1.registerLanguage("brainfuck", dO4());
    r1.registerLanguage("c-like", lO4());
    r1.registerLanguage("c", nO4());
    r1.registerLanguage("cal", oO4());
    r1.registerLanguage("capnproto", sO4());
    r1.registerLanguage("ceylon", eO4());
    r1.registerLanguage("clean", q$4());
    r1.registerLanguage("clojure", Y$4());
    r1.registerLanguage("clojure-repl", _$4());
    r1.registerLanguage("cmake", O$4());
    r1.registerLanguage("coffeescript", H$4());
    r1.registerLanguage("coq", J$4());
    r1.registerLanguage("cos", D$4());
    r1.registerLanguage("cpp", P$4());
    r1.registerLanguage("crmsh", Z$4());
    r1.registerLanguage("crystal", f$4());
    r1.registerLanguage("csharp", v$4());
    r1.registerLanguage("csp", V$4());
    r1.registerLanguage("css", E$4());
    r1.registerLanguage("d", L$4());
    r1.registerLanguage("markdown", h$4());
    r1.registerLanguage("dart", C$4());
    r1.registerLanguage("delphi", b$4());
    r1.registerLanguage("diff", u$4());
    r1.registerLanguage("django", B$4());
    r1.registerLanguage("dns", F$4());
    r1.registerLanguage("dockerfile", Q$4());
    r1.registerLanguage("dos", d$4());
    r1.registerLanguage("dsconfig", l$4());
    r1.registerLanguage("dts", n$4());
    r1.registerLanguage("dust", o$4());
    r1.registerLanguage("ebnf", s$4());
    r1.registerLanguage("elixir", e$4());
    r1.registerLanguage("elm", qH4());
    r1.registerLanguage("ruby", zH4());
    r1.registerLanguage("erb", wH4());
    r1.registerLanguage("erlang-repl", $H4());
    r1.registerLanguage("erlang", jH4());
    r1.registerLanguage("excel", MH4());
    r1.registerLanguage("fix", XH4());
    r1.registerLanguage("flix", WH4());
    r1.registerLanguage("fortran", GH4());
    r1.registerLanguage("fsharp", TH4());
    r1.registerLanguage("gams", NH4());
    r1.registerLanguage("gauss", kH4());
    r1.registerLanguage("gcode", yH4());
    r1.registerLanguage("gherkin", RH4());
    r1.registerLanguage("glsl", SH4());
    r1.registerLanguage("gml", IH4());
    r1.registerLanguage("go", xH4());
    r1.registerLanguage("golo", mH4());
    r1.registerLanguage("gradle", gH4());
    r1.registerLanguage("groovy", pH4());
    r1.registerLanguage("haml", UH4());
    r1.registerLanguage("handlebars", lH4());
    r1.registerLanguage("haskell", nH4());
    r1.registerLanguage("haxe", oH4());
    r1.registerLanguage("hsp", sH4());
    r1.registerLanguage("htmlbars", Aj4());
    r1.registerLanguage("http", Kj4());
    r1.registerLanguage("hy", zj4());
    r1.registerLanguage("inform7", wj4());
    r1.registerLanguage("ini", jj4());
    r1.registerLanguage("irpf90", Mj4());
    r1.registerLanguage("isbl", Xj4());
    r1.registerLanguage("java", Wj4());
    r1.registerLanguage("javascript", fj4());
    r1.registerLanguage("jboss-cli", vj4());
    r1.registerLanguage("json", Vj4());
    r1.registerLanguage("julia", Ej4());
    r1.registerLanguage("julia-repl", Lj4());
    r1.registerLanguage("kotlin", hj4());
    r1.registerLanguage("lasso", Cj4());
    r1.registerLanguage("latex", bj4());
    r1.registerLanguage("ldif", uj4());
    r1.registerLanguage("leaf", Bj4());
    r1.registerLanguage("less", Qj4());
    r1.registerLanguage("lisp", dj4());
    r1.registerLanguage("livecodeserver", lj4());
    r1.registerLanguage("livescript", nj4());
    r1.registerLanguage("llvm", oj4());
    r1.registerLanguage("lsl", sj4());
    r1.registerLanguage("lua", ej4());
    r1.registerLanguage("makefile", qJ4());
    r1.registerLanguage("mathematica", wJ4());
    r1.registerLanguage("matlab", $J4());
    r1.registerLanguage("maxima", jJ4());
    r1.registerLanguage("mel", MJ4());
    r1.registerLanguage("mercury", XJ4());
    r1.registerLanguage("mipsasm", WJ4());
    r1.registerLanguage("mizar", GJ4());
    r1.registerLanguage("perl", NJ4());
    r1.registerLanguage("mojolicious", kJ4());
    r1.registerLanguage("monkey", yJ4());
    r1.registerLanguage("moonscript", RJ4());
    r1.registerLanguage("n1ql", SJ4());
    r1.registerLanguage("nginx", IJ4());
    r1.registerLanguage("nim", xJ4());
    r1.registerLanguage("nix", mJ4());
    r1.registerLanguage("node-repl", gJ4());
    r1.registerLanguage("nsis", pJ4());
    r1.registerLanguage("objectivec", UJ4());
    r1.registerLanguage("ocaml", cJ4());
    r1.registerLanguage("openscad", iJ4());
    r1.registerLanguage("oxygene", rJ4());
    r1.registerLanguage("parser3", aJ4());
    r1.registerLanguage("pf", tJ4());
    r1.registerLanguage("pgsql", AM4());
    r1.registerLanguage("php", KM4());
    r1.registerLanguage("php-template", zM4());
    r1.registerLanguage("plaintext", wM4());
    r1.registerLanguage("pony", $M4());
    r1.registerLanguage("powershell", jM4());
    r1.registerLanguage("processing", MM4());
    r1.registerLanguage("profile", XM4());
    r1.registerLanguage("prolog", WM4());
    r1.registerLanguage("properties", GM4());
    r1.registerLanguage("protobuf", TM4());
    r1.registerLanguage("puppet", NM4());
    r1.registerLanguage("purebasic", kM4());
    r1.registerLanguage("python", yM4());
    r1.registerLanguage("python-repl", RM4());
    r1.registerLanguage("q", SM4());
    r1.registerLanguage("qml", IM4());
    r1.registerLanguage("r", xM4());
    r1.registerLanguage("reasonml", mM4());
    r1.registerLanguage("rib", gM4());
    r1.registerLanguage("roboconf", pM4());
    r1.registerLanguage("routeros", UM4());
    r1.registerLanguage("rsl", cM4());
    r1.registerLanguage("ruleslanguage", iM4());
    r1.registerLanguage("rust", rM4());
    r1.registerLanguage("sas", aM4());
    r1.registerLanguage("scala", tM4());
    r1.registerLanguage("scheme", AD4());
    r1.registerLanguage("scilab", KD4());
    r1.registerLanguage("scss", zD4());
    r1.registerLanguage("shell", wD4());
    r1.registerLanguage("smali", $D4());
    r1.registerLanguage("smalltalk", jD4());
    r1.registerLanguage("sml", MD4());
    r1.registerLanguage("sqf", XD4());
    r1.registerLanguage("sql_more", WD4());
    r1.registerLanguage("sql", fD4());
    r1.registerLanguage("stan", vD4());
    r1.registerLanguage("stata", VD4());
    r1.registerLanguage("step21", ED4());
    r1.registerLanguage("stylus", LD4());
    r1.registerLanguage("subunit", hD4());
    r1.registerLanguage("swift", gD4());
    r1.registerLanguage("taggerscript", pD4());
    r1.registerLanguage("yaml", UD4());
    r1.registerLanguage("tap", cD4());
    r1.registerLanguage("tcl", nD4());
    r1.registerLanguage("thrift", oD4());
    r1.registerLanguage("tp", sD4());
    r1.registerLanguage("twig", eD4());
    r1.registerLanguage("typescript", _X4());
    r1.registerLanguage("vala", OX4());
    r1.registerLanguage("vbnet", jX4());
    r1.registerLanguage("vbscript", DX4());
    r1.registerLanguage("vbscript-html", PX4());
    r1.registerLanguage("verilog", ZX4());
    r1.registerLanguage("vhdl", fX4());
    r1.registerLanguage("vim", vX4());
    r1.registerLanguage("x86asm", VX4());
    r1.registerLanguage("xl", EX4());
    r1.registerLanguage("xquery", LX4());
    r1.registerLanguage("zephir", hX4());
    SX4.exports = r1
})
// @from(Ln 267919, Col 4)
UW1 = x((Nr9) => {
    var vr9 = [65534, 65535, 131070, 131071, 196606, 196607, 262142, 262143, 327678, 327679, 393214, 393215, 458750, 458751, 524286, 524287, 589822, 589823, 655358, 655359, 720894, 720895, 786430, 786431, 851966, 851967, 917502, 917503, 983038, 983039, 1048574, 1048575, 1114110, 1114111];
    Nr9.REPLACEMENT_CHARACTER = "�";
    Nr9.CODE_POINTS = {
        EOF: -1,
        NULL: 0,
        TABULATION: 9,
        CARRIAGE_RETURN: 13,
        LINE_FEED: 10,
        FORM_FEED: 12,
        SPACE: 32,
        EXCLAMATION_MARK: 33,
        QUOTATION_MARK: 34,
        NUMBER_SIGN: 35,
        AMPERSAND: 38,
        APOSTROPHE: 39,
        HYPHEN_MINUS: 45,
        SOLIDUS: 47,
        DIGIT_0: 48,
        DIGIT_9: 57,
        SEMICOLON: 59,
        LESS_THAN_SIGN: 60,
        EQUALS_SIGN: 61,
        GREATER_THAN_SIGN: 62,
        QUESTION_MARK: 63,
        LATIN_CAPITAL_A: 65,
        LATIN_CAPITAL_F: 70,
        LATIN_CAPITAL_X: 88,
        LATIN_CAPITAL_Z: 90,
        RIGHT_SQUARE_BRACKET: 93,
        GRAVE_ACCENT: 96,
        LATIN_SMALL_A: 97,
        LATIN_SMALL_F: 102,
        LATIN_SMALL_X: 120,
        LATIN_SMALL_Z: 122,
        REPLACEMENT_CHARACTER: 65533
    };
    Nr9.CODE_POINT_SEQUENCES = {
        DASH_DASH_STRING: [45, 45],
        DOCTYPE_STRING: [68, 79, 67, 84, 89, 80, 69],
        CDATA_START_STRING: [91, 67, 68, 65, 84, 65, 91],
        SCRIPT_STRING: [115, 99, 114, 105, 112, 116],
        PUBLIC_STRING: [80, 85, 66, 76, 73, 67],
        SYSTEM_STRING: [83, 89, 83, 84, 69, 77]
    };
    Nr9.isSurrogate = function(A) {
        return A >= 55296 && A <= 57343
    };
    Nr9.isSurrogatePair = function(A) {
        return A >= 56320 && A <= 57343
    };
    Nr9.getSurrogatePairCodePoint = function(A, q) {
        return (A - 55296) * 1024 + 9216 + q
    };
    Nr9.isControlCodePoint = function(A) {
        return A !== 32 && A !== 10 && A !== 13 && A !== 9 && A !== 12 && A >= 1 && A <= 31 || A >= 127 && A <= 159
    };
    Nr9.isUndefinedCodePoint = function(A) {
        return A >= 64976 && A <= 65007 || vr9.indexOf(A) > -1
    }
})
// @from(Ln 267980, Col 4)
dW1 = x((G5w, CX4) => {
    CX4.exports = {
        controlCharacterInInputStream: "control-character-in-input-stream",
        noncharacterInInputStream: "noncharacter-in-input-stream",
        surrogateInInputStream: "surrogate-in-input-stream",
        nonVoidHtmlElementStartTagWithTrailingSolidus: "non-void-html-element-start-tag-with-trailing-solidus",
        endTagWithAttributes: "end-tag-with-attributes",
        endTagWithTrailingSolidus: "end-tag-with-trailing-solidus",
        unexpectedSolidusInTag: "unexpected-solidus-in-tag",
        unexpectedNullCharacter: "unexpected-null-character",
        unexpectedQuestionMarkInsteadOfTagName: "unexpected-question-mark-instead-of-tag-name",
        invalidFirstCharacterOfTagName: "invalid-first-character-of-tag-name",
        unexpectedEqualsSignBeforeAttributeName: "unexpected-equals-sign-before-attribute-name",
        missingEndTagName: "missing-end-tag-name",
        unexpectedCharacterInAttributeName: "unexpected-character-in-attribute-name",
        unknownNamedCharacterReference: "unknown-named-character-reference",
        missingSemicolonAfterCharacterReference: "missing-semicolon-after-character-reference",
        unexpectedCharacterAfterDoctypeSystemIdentifier: "unexpected-character-after-doctype-system-identifier",
        unexpectedCharacterInUnquotedAttributeValue: "unexpected-character-in-unquoted-attribute-value",
        eofBeforeTagName: "eof-before-tag-name",
        eofInTag: "eof-in-tag",
        missingAttributeValue: "missing-attribute-value",
        missingWhitespaceBetweenAttributes: "missing-whitespace-between-attributes",
        missingWhitespaceAfterDoctypePublicKeyword: "missing-whitespace-after-doctype-public-keyword",
        missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers: "missing-whitespace-between-doctype-public-and-system-identifiers",
        missingWhitespaceAfterDoctypeSystemKeyword: "missing-whitespace-after-doctype-system-keyword",
        missingQuoteBeforeDoctypePublicIdentifier: "missing-quote-before-doctype-public-identifier",
        missingQuoteBeforeDoctypeSystemIdentifier: "missing-quote-before-doctype-system-identifier",
        missingDoctypePublicIdentifier: "missing-doctype-public-identifier",
        missingDoctypeSystemIdentifier: "missing-doctype-system-identifier",
        abruptDoctypePublicIdentifier: "abrupt-doctype-public-identifier",
        abruptDoctypeSystemIdentifier: "abrupt-doctype-system-identifier",
        cdataInHtmlContent: "cdata-in-html-content",
        incorrectlyOpenedComment: "incorrectly-opened-comment",
        eofInScriptHtmlCommentLikeText: "eof-in-script-html-comment-like-text",
        eofInDoctype: "eof-in-doctype",
        nestedComment: "nested-comment",
        abruptClosingOfEmptyComment: "abrupt-closing-of-empty-comment",
        eofInComment: "eof-in-comment",
        incorrectlyClosedComment: "incorrectly-closed-comment",
        eofInCdata: "eof-in-cdata",
        absenceOfDigitsInNumericCharacterReference: "absence-of-digits-in-numeric-character-reference",
        nullCharacterReference: "null-character-reference",
        surrogateCharacterReference: "surrogate-character-reference",
        characterReferenceOutsideUnicodeRange: "character-reference-outside-unicode-range",
        controlCharacterReference: "control-character-reference",
        noncharacterCharacterReference: "noncharacter-character-reference",
        missingWhitespaceBeforeDoctypeName: "missing-whitespace-before-doctype-name",
        missingDoctypeName: "missing-doctype-name",
        invalidCharacterSequenceAfterDoctypeName: "invalid-character-sequence-after-doctype-name",
        duplicateAttribute: "duplicate-attribute",
        nonConformingDoctype: "non-conforming-doctype",
        missingDoctype: "missing-doctype",
        misplacedDoctype: "misplaced-doctype",
        endTagWithoutMatchingOpenElement: "end-tag-without-matching-open-element",
        closingOfElementWithOpenChildElements: "closing-of-element-with-open-child-elements",
        disallowedContentInNoscriptInHead: "disallowed-content-in-noscript-in-head",
        openElementsLeftAfterEof: "open-elements-left-after-eof",
        abandonedHeadElementChild: "abandoned-head-element-child",
        misplacedStartTagForHeadElement: "misplaced-start-tag-for-head-element",
        nestedNoscriptInHead: "nested-noscript-in-head",
        eofInElementThatCanContainOnlyText: "eof-in-element-that-can-contain-only-text"
    }
})
// @from(Ln 268044, Col 4)
xX4 = x((f5w, bX4) => {
    var GZ6 = UW1(),
        oE8 = dW1(),
        f96 = GZ6.CODE_POINTS;
    class IX4 {
        constructor() {
            this.html = null, this.pos = -1, this.lastGapPos = -1, this.lastCharPos = -1, this.gapStack = [], this.skipNextNewLine = !1, this.lastChunkWritten = !1, this.endOfChunkHit = !1, this.bufferWaterline = 65536
        }
        _err() {}
        _addGap() {
            this.gapStack.push(this.lastGapPos), this.lastGapPos = this.pos
        }
        _processSurrogate(A) {
            if (this.pos !== this.lastCharPos) {
                let q = this.html.charCodeAt(this.pos + 1);
                if (GZ6.isSurrogatePair(q)) return this.pos++, this._addGap(), GZ6.getSurrogatePairCodePoint(A, q)
            } else if (!this.lastChunkWritten) return this.endOfChunkHit = !0, f96.EOF;
            return this._err(oE8.surrogateInInputStream), A
        }
        dropParsedChunk() {
            if (this.pos > this.bufferWaterline) this.lastCharPos -= this.pos, this.html = this.html.substring(this.pos), this.pos = 0, this.lastGapPos = -1, this.gapStack = []
        }
        write(A, q) {
            if (this.html) this.html += A;
            else this.html = A;
            this.lastCharPos = this.html.length - 1, this.endOfChunkHit = !1, this.lastChunkWritten = q
        }
        insertHtmlAtCurrentPos(A) {
            this.html = this.html.substring(0, this.pos + 1) + A + this.html.substring(this.pos + 1, this.html.length), this.lastCharPos = this.html.length - 1, this.endOfChunkHit = !1
        }
        advance() {
            if (this.pos++, this.pos > this.lastCharPos) return this.endOfChunkHit = !this.lastChunkWritten, f96.EOF;
            let A = this.html.charCodeAt(this.pos);
            if (this.skipNextNewLine && A === f96.LINE_FEED) return this.skipNextNewLine = !1, this._addGap(), this.advance();
            if (A === f96.CARRIAGE_RETURN) return this.skipNextNewLine = !0, f96.LINE_FEED;
            if (this.skipNextNewLine = !1, GZ6.isSurrogate(A)) A = this._processSurrogate(A);
            if (!(A > 31 && A < 127 || A === f96.LINE_FEED || A === f96.CARRIAGE_RETURN || A > 159 && A < 64976)) this._checkForProblematicCharacters(A);
            return A
        }
        _checkForProblematicCharacters(A) {
            if (GZ6.isControlCodePoint(A)) this._err(oE8.controlCharacterInInputStream);
            else if (GZ6.isUndefinedCodePoint(A)) this._err(oE8.noncharacterInInputStream)
        }
        retreat() {
            if (this.pos === this.lastGapPos) this.lastGapPos = this.gapStack.pop(), this.pos--;
            this.pos--
        }
    }
    bX4.exports = IX4
})