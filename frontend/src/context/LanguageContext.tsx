/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';

export type SupportedLanguage = 'en' | 'te' | 'hi' | 'ta' | 'mr' | 'bn';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Nav & Sidebar
    nav_dashboard: 'Dashboard Overview',
    nav_copilot: 'Ask AI Assistant',
    nav_demand: 'Citizen Complaints',
    nav_feedback: 'Community Wall',
    nav_hotspots: 'Problem Hotspots',
    nav_gaps: 'Facility Shortfalls',
    nav_recommendations: 'Top Priority Projects',
    nav_evidence: 'Proof & Evidence',
    nav_scenarios: 'Budget Simulator',
    nav_data: 'Submit & Explore Data',
    nav_raise_complaint: 'Raise Complaint',
    nav_search: 'Search...',
    nav_signin: 'Sign In',

    // Sidebar Groups
    group_voices: 'COMMUNITY VOICES & AI',
    group_priorities: 'PRIORITIES & BUDGET',
    group_data: 'ALL DATA & REPORTS',

    // Dashboard Overview
    dash_title: 'Civic Demand Intelligence & Infrastructure Cockpit',
    dash_subtitle: 'Real-time multi-lingual citizen feedback synthesis across 35 BRICS districts',
    stat_demands: 'Verified Demands',
    stat_regions: 'Monitored Regions',
    stat_deficits: 'Infrastructure Deficits',
    stat_investments: 'Capital Projects',
    top_priorities_title: 'Top Priority Infrastructure Recommendations',
    view_evidence: 'View Evidence',
    simulate_budget: 'Simulate Budget',

    // Hero Buttons
    btn_view_complaints: 'View Complaints',
    btn_citizen_voices: 'Citizen Voices',
    btn_budget_sim: 'Budget Simulator',
    btn_problem_hotspots: 'Problem Hotspots',

    // Metric Card Titles
    metric_total_complaints: 'TOTAL COMPLAINTS LOGGED',
    metric_districts_monitored: 'DISTRICTS MONITORED',
    metric_facility_shortfalls: 'FACILITY SHORTFALLS FOUND',
    metric_urgent_projects: 'URGENT PRIORITY PROJECTS',

    // Citizen Complaints Page
    demand_page_title: 'Citizen Complaints & Feedback Trends',
    signals_logged_label: 'SIGNALS LOGGED',
    studio_title: 'Multilingual Citizen Voice Studio',
    studio_sub: 'Submit citizen feedback in Telugu, Hindi, Marathi, Portuguese, Zulu, Bengali, or English to generate structured demand signals.',
    target_region_label: 'Target Region:',
    btn_region_details: 'Region Details',
    try_signal_label: 'TRY A MULTILINGUAL CIVIC SIGNAL:',
    placeholder_feedback: "Type or paste citizen feedback in any language (e.g. 'మా ప్రాంతంలో సరైన ఆసుపత్రి సౌకర్యాలు లేవు.')...",
    btn_analyze_signal: 'Analyze Civic Signal',
    complaints_title: 'Filtered Citizen Requests',
    showing_verified: 'Showing verified demand signals',
    translation_label: 'Translation:',

    // Raise Complaint Modal
    raise_modal_title: 'Raise Your Complaint',
    raise_modal_sub: 'Report broken infrastructure, service outages, or local civic issues directly to priority models.',
    badge_verified_citizen: 'VERIFIED CITIZEN',
    guest_banner_text: 'Raising as Guest Citizen (Or log in to track status)',
    label_sector_category: 'SECTOR CATEGORY *',
    label_urgency_level: 'URGENCY LEVEL *',
    label_language: 'LANGUAGE *',
    label_channel: 'CHANNEL *',
    label_describe_problem: 'DESCRIBE YOUR PROBLEM IN DETAIL *',
    label_live_location: 'LIVE LOCATION',
    label_photo_evidence: 'PHOTO EVIDENCE',
    btn_fetch_gps: 'Fetch GPS',
    btn_live_camera: 'Live Camera',
    btn_record_voice: 'Record Voice Note',
    placeholder_describe: 'Explain the civic problem clearly (e.g., Severe drinking water supply disruption in Vijayawada Ward 4 for the past 3 days; pipeline leakage leaking onto main road)...',
    btn_submit_complaint: 'Fast-Track & Submit Civic Complaint',

    // Auth Modal
    create_account: 'Create Citizen Account',
    welcome_back: 'Welcome Back',
    signup_tab: 'New User (Sign Up)',
    login_tab: 'Existing User (Log In)',
    full_name: 'Full Name',
    email_address: 'Email Address',
    phone_number: 'Phone Number',
    your_district: 'Your District / Location',
    password_label: 'Password',
    create_btn: 'Create Account & Continue',
    login_btn: 'Log In to Account',
    demo_login: 'One-Click Quick Sign In as Verified Citizen (Demo)',

    // Community Wall
    wall_title: 'Community Feedback Wall',
    wall_sub: 'COMMUNITY FEEDBACK WALL',
    btn_post_feedback: 'Post Feedback',
    tag_public_voice: 'Public Community Voice',
    tag_verified_posts: 'Verified Citizen Posts',
    label_filter_sentiment: 'Filter Sentiment:',
    label_state_filter: 'State:',
    btn_upvote: 'Upvote',

    // Problem Hotspots
    hotspots_title: 'Problem Hotspots',
    tag_normalized_pop: 'Normalized by Population Size',
    tag_high_urgency: 'High Urgency Locations',
    matrix_header: 'DEMAND INTENSITY HEAT MATRIX',
    region_profile: 'REGION PROFILE',
    pop_label: 'Population',
    vuln_label: 'Vulnerability Index',
    youth_label: 'Youth Demographic %',
    elderly_label: 'Elderly Demographic %',
    primary_lang: 'Primary Language',
    evidence_priorities: 'Evidence Priorities',

    // Facility Shortfalls
    gaps_title: 'Facility Shortfalls & Capacity Deficits',
    gaps_sub: 'FACILITY SHORTFALLS & GAPS',
    tag_core_sectors: '6 Core Sectors',
    tag_shortfall_matrix: 'District Shortfall Matrix',
    understanding_deficits: 'Understanding Deficit Scores & Severity Levels:',
    critical_deficit: 'Critical Deficit',
    high_deficit: 'High Deficit',
    stable_coverage: 'Stable',
    coverage_vs_shortfall: 'Coverage vs Shortfall',

    // Top Priority Projects
    recs_title: 'Top Priority Projects',
    tag_ranked_order: 'Ranked Priority Order',
    tag_action_rec: 'Action Recommended',
    view_evidence_trail: 'View Evidence Trail',

    // Proof & Evidence Explorer
    evidence_title: 'Proof & Evidence Explorer',
    tag_why_picked: 'Why This Project Was Picked',
    tag_transparent_trail: 'Transparent Proof Trail',
    sec_chains_title: '6-Step Recommendation Evidence Chains',
    sec_chains_sub: 'Select a recommendation to inspect its complete machine-readable evidence trail.',
    btn_open_chain: 'Open Evidence Chain',
  },

  te: {
    // Nav & Sidebar
    nav_dashboard: 'డాష్‌బోర్డ్ అవలోకనం',
    nav_copilot: 'AI సహాయకుడిని అడగండి',
    nav_demand: 'పౌరుల ఫిర్యాదులు',
    nav_feedback: 'ప్రజా సమస్యల గోడ',
    nav_hotspots: 'సమస్యల హాట్‌స్పాట్‌లు',
    nav_gaps: 'వసతుల కొరత',
    nav_recommendations: 'అగ్ర ప్రాధాన్యత ప్రాజెక్ట్‌లు',
    nav_evidence: 'సాక్ష్యాలు & ఆధారాలు',
    nav_scenarios: 'బడ్జెట్ సిమ్యులేటర్',
    nav_data: 'డేటా సమర్పించండి & చూడండి',
    nav_raise_complaint: 'ఫిర్యాదు నమోదు చేయండి',
    nav_search: 'వెతకండి...',
    nav_signin: 'లాగిన్ చేయండి',

    // Sidebar Groups
    group_voices: 'ప్రజా గొంతుకలు & AI',
    group_priorities: 'ప్రాధాన్యతలు & బడ్జెట్',
    group_data: 'అన్ని డేటా నివేదికలు',

    // Dashboard Overview
    dash_title: 'సివిక్ డిమాండ్ ఇంటెలిజెన్స్ & ఇన్‌ఫ్రాస్ట్రక్చర్ కాక్‌పిట్',
    dash_subtitle: '35 BRICS జిల్లాల నుండి పౌరుల బహుభాషా అభిప్రాయాల రియల్ టైమ్ విశ్లేషణ',
    stat_demands: 'ధృవీకరించబడిన డిమాండ్లు',
    stat_regions: 'పర్యవేక్షించబడుతున్న ప్రాంతాలు',
    stat_deficits: 'మౌలిక సదుపాయాల కొరత',
    stat_investments: 'మూలధన ప్రాజెక్ట్‌లు',
    top_priorities_title: 'అగ్ర ప్రాధాన్యత మౌలిక సదుపాయాల సిఫార్సులు',
    view_evidence: 'సాక్ష్యం చూడండి',
    simulate_budget: 'బడ్జెట్ సిమ్యులేట్ చేయండి',

    // Hero Buttons
    btn_view_complaints: 'ఫిర్యాదులు చూడండి',
    btn_citizen_voices: 'పౌరుల స్వరం',
    btn_budget_sim: 'బడ్జెట్ సిమ్యులేటర్',
    btn_problem_hotspots: 'సమస్యల హాట్‌స్పాట్‌లు',

    // Metric Card Titles
    metric_total_complaints: 'మొత్తం నమోదైన ఫిర్యాదులు',
    metric_districts_monitored: 'పర్యవేక్షించబడుతున్న జిల్లాలు',
    metric_facility_shortfalls: 'గుర్తించిన వసతుల కొరత',
    metric_urgent_projects: 'అత్యవసర ప్రాధాన్యత ప్రాజెక్ట్‌లు',

    // Citizen Complaints Page
    demand_page_title: 'పౌరుల ఫిర్యాదులు & ట్రెండ్‌లు',
    signals_logged_label: 'నమోదైన సంకేతాలు',
    studio_title: 'బహుభాషా పౌర స్వర స్టూడియో',
    studio_sub: 'తెలుగు, హిందీ, మరాఠీ, ఇంగ్లీషులలో మీ ప్రజా సమస్యను నమోదు చేయండి.',
    target_region_label: 'లక్ష్య ప్రాంతం:',
    btn_region_details: 'ప్రాంతం వివరాలు',
    try_signal_label: 'ఉదాహరణ సమస్యను ప్రయత్నించండి:',
    placeholder_feedback: "మీ ప్రాంతంలోని సమస్యను ఇక్కడ టైప్ చేయండి లేదా పేస్ట్ చేయండి (ఉదా: 'మా ప్రాంతంలో సరైన ఆసుపత్రి సౌకర్యాలు లేవు.')...",
    btn_analyze_signal: 'సమస్యను విశ్లేషించండి',
    complaints_title: 'ఫిల్టర్ చేసిన పౌరుల అభ్యర్థనలు',
    showing_verified: 'ధృవీకరించబడిన డిమాండ్ సంకేతాలను చూపుతోంది',
    translation_label: 'అనువాదం:',

    // Raise Complaint Modal
    raise_modal_title: 'మీ ఫిర్యాదును నమోదు చేయండి',
    raise_modal_sub: 'రోడ్లు, నీరు, విద్యుత్ సమస్యలను నేరుగా నమోదు చేసి సమర్పించండి.',
    badge_verified_citizen: 'ధృవీకరించబడిన పౌరుడు',
    guest_banner_text: 'అతిథి పౌరుడిగా నమోదు చేస్తున్నారు (లేదా లాగిన్ అవ్వండి)',
    label_sector_category: 'సమస్య విభాగం *',
    label_urgency_level: 'అత్యవసర స్థాయి *',
    label_language: 'భాష *',
    label_channel: 'మాధ్యమం *',
    label_describe_problem: 'మీ సమస్యను వివరంగా వర్ణించండి *',
    label_live_location: 'లైవ్ లొకేషన్',
    label_photo_evidence: 'ఫోటో ఆధారం',
    btn_fetch_gps: 'GPS లొకేషన్ తీసుకోండి',
    btn_live_camera: 'లైవ్ కెమెరా',
    btn_record_voice: 'వాయిస్ రికార్డ్ చేయండి',
    placeholder_describe: 'మీ ప్రాంతంలోని సమస్యను స్పష్టంగా వివరించండి (ఉదా: విజయవాడ వార్డు 4 లో మంచి నీటి పైప్‌లైన్ పగిలిపోయింది)...',
    btn_submit_complaint: 'ఫిర్యాదును తక్షణమే సమర్పించండి',

    // Auth Modal
    create_account: 'పౌర ఖాతాను సృష్టించండి',
    welcome_back: 'తిరిగి స్వాగతం',
    signup_tab: 'కొత్త వినియోగదారు (సైన్ అప్)',
    login_tab: 'ఉన్నత వినియోగదారు (లాగిన్)',
    full_name: 'పూర్తి పేరు',
    email_address: 'ఈమెయిల్ చిరునామా',
    phone_number: 'ఫోన్ నంబరు',
    your_district: 'మీ జిల్లా / ప్రాంతం',
    password_label: 'పాస్‌వర్డ్',
    create_btn: 'ఖాతాను సృష్టించి కొనసాగించండి',
    login_btn: 'ఖాతాలోకి లాగిన్ అవ్వండి',
    demo_login: 'ఒకే క్లిక్‌లో లాగిన్ అవ్వండి (డెమో)',

    // Community Wall
    wall_title: 'ప్రజా సమస్యల గోడ',
    wall_sub: 'సమాజ అభిప్రాయాల గోడ',
    btn_post_feedback: 'అభిప్రాయాన్ని పోస్ట్ చేయండి',
    tag_public_voice: 'ప్రజా గొంతుక',
    tag_verified_posts: 'ధృవీకరించబడిన పౌరుల పోస్ట్‌లు',
    label_filter_sentiment: 'సెంటిమెంట్ ఫిల్టర్:',
    label_state_filter: 'రాష్ట్రం:',
    btn_upvote: 'మద్దతు తెలపండి',

    // Problem Hotspots
    hotspots_title: 'సమస్యల హాట్‌స్పాట్‌లు',
    tag_normalized_pop: 'జనాభా ఆధారంగా వర్గీకరించబడింది',
    tag_high_urgency: 'అత్యంత అత్యవసర ప్రాంతాలు',
    matrix_header: 'డిమాండ్ తీవ్రత హీట్ మ్యాట్రిక్స్',
    region_profile: 'ప్రాంతం ప్రొఫైల్',
    pop_label: 'జనాభా',
    vuln_label: 'సమస్య సూచిక',
    youth_label: 'యువత %',
    elderly_label: 'వృద్ధులు %',
    primary_lang: 'ప్రధాన భాష',
    evidence_priorities: 'సాక్ష్యాల ప్రాధాన్యతలు',

    // Facility Shortfalls
    gaps_title: 'వసతుల కొరత & సామర్థ్య లోపాలు',
    gaps_sub: 'వసతుల కొరత & వ్యత్యాసాలు',
    tag_core_sectors: '6 ప్రధాన రంగాలు',
    tag_shortfall_matrix: 'జిల్లా కొరత మ్యాట్రిక్స్',
    understanding_deficits: 'కొరత స్కోర్లు & తీవ్రత స్థాయిలను అర్థం చేసుకోవడం:',
    critical_deficit: 'తీవ్రమైన కొరత',
    high_deficit: 'అధిక కొరత',
    stable_coverage: 'స్థిరమైనది',
    coverage_vs_shortfall: 'కవరేజ్ వర్సెస్ కొరత',

    // Top Priority Projects
    recs_title: 'అగ్ర ప్రాధాన్యత ప్రాజెక్ట్‌లు',
    tag_ranked_order: 'ర్యాంక్ చేసిన ప్రాధాన్యతా క్రమం',
    tag_action_rec: 'సిఫార్సు చేసిన చర్యలు',
    view_evidence_trail: 'సాక్ష్యాల సిరీస్ చూడండి',

    // Proof & Evidence Explorer
    evidence_title: 'సాక్ష్యాలు & ఆధారాల అన్వేషణ',
    tag_why_picked: 'ఈ ప్రాజెక్ట్‌ను ఎందుకు ఎంచుకున్నారు',
    tag_transparent_trail: 'పారదర్శక సాక్ష్యాల ట్రైల్',
    sec_chains_title: '6-దశల సాక్ష్యాల గొలుసు',
    sec_chains_sub: 'సంపూర్ణ ఆధారాన్ని చూడటానికి ఒక సిఫార్సును ఎంచుకోండి.',
    btn_open_chain: 'సాక్ష్యాల సిరీస్ తెరవండి',
  },

  hi: {
    // Nav & Sidebar
    nav_dashboard: 'डैशबोर्ड अवलोकन',
    nav_copilot: 'AI सहायक से पूछें',
    nav_demand: 'नागरिक शिकायतें',
    nav_feedback: 'सामुदायिक फीडबैक वॉल',
    nav_hotspots: 'समस्या हॉटस्पॉट',
    nav_gaps: 'सुविधाओं की कमी',
    nav_recommendations: 'शीर्ष प्राथमिकता परियोजनाएं',
    nav_evidence: 'प्रमाण एवं साक्ष्य',
    nav_scenarios: 'बजट सिम्युलेटर',
    nav_data: 'डेटा जमा करें और देखें',
    nav_raise_complaint: 'शिकायत दर्ज करें',
    nav_search: 'खोजें...',
    nav_signin: 'साइन इन करें',

    // Sidebar Groups
    group_voices: 'नागरिक आवाजें और AI',
    group_priorities: 'प्राथमिकताएं और बजट',
    group_data: 'सभी डेटा और रिपोर्ट',

    // Dashboard Overview
    dash_title: 'नागरिक मांग खुफिया और बुनियादी ढांचा कॉकपिट',
    dash_subtitle: '35 बीआरआईसीएस जिलों से वास्तविक समय में बहुभाषी नागरिक प्रतिक्रिया का विश्लेषण',
    stat_demands: 'सत्यापित मांगें',
    stat_regions: 'निगरानी वाले क्षेत्र',
    stat_deficits: 'बुनियादी ढांचे का घाटा',
    stat_investments: 'पूंजीगत परियोजनाएं',
    top_priorities_title: 'शीर्ष प्राथमिकता बुनियादी ढांचा सिफारिशें',
    view_evidence: 'साक्ष्य देखें',
    simulate_budget: 'बजट अनुकरण करें',

    // Hero Buttons
    btn_view_complaints: 'शिकायतें देखें',
    btn_citizen_voices: 'नागरिक आवाजें',
    btn_budget_sim: 'बजट सिम्युलेटर',
    btn_problem_hotspots: 'समस्या हॉटस्पॉट',

    // Metric Card Titles
    metric_total_complaints: 'कुल दर्ज शिकायतें',
    metric_districts_monitored: 'निगरानी वाले जिले',
    metric_facility_shortfalls: 'पाई गई सुविधाओं की कमी',
    metric_urgent_projects: 'अत्यावश्यक प्राथमिकता परियोजनाएं',

    // Citizen Complaints Page
    demand_page_title: 'नागरिक शिकायतें और रुझान',
    signals_logged_label: 'दर्ज संकेत',
    studio_title: 'बहुभाषी नागरिक आवाज स्टूडियो',
    studio_sub: 'अपनी समस्या हिंदी, तेलुगु, मराठी, अंग्रेजी में प्रस्तुत करें।',
    target_region_label: 'लक्ष्य क्षेत्र:',
    btn_region_details: 'क्षेत्र विवरण',
    try_signal_label: 'उदाहरण समस्या आज़माएं:',
    placeholder_feedback: "किसी भी भाषा में अपनी समस्या यहाँ टाइप करें (उदा: 'हमारे इलाके में अस्पताल की सुविधा नहीं है।')...",
    btn_analyze_signal: 'समस्या का विश्लेषण करें',
    complaints_title: 'फ़िल्टर की गई नागरिक शिकायतें',
    showing_verified: 'सत्यापित मांग संकेतों को दिखाया जा रहा है',
    translation_label: 'अनुवाद:',

    // Raise Complaint Modal
    raise_modal_title: 'अपनी शिकायत दर्ज करें',
    raise_modal_sub: 'टूटी सड़कों, पानी की आपूर्ति, या बिजली की समस्या सीधे दर्ज करें।',
    badge_verified_citizen: 'सत्यापित नागरिक',
    guest_banner_text: 'अतिथि नागरिक के रूप में दर्ज कर रहे हैं (या लॉग इन करें)',
    label_sector_category: 'क्षेत्र श्रेणी *',
    label_urgency_level: 'अत्यावश्यकता स्तर *',
    label_language: 'भाषा *',
    label_channel: 'माध्यम *',
    label_describe_problem: 'अपनी समस्या का विस्तृत विवरण दें *',
    label_live_location: 'लाइव लोकेशन',
    label_photo_evidence: 'फोटो साक्ष्य',
    btn_fetch_gps: 'GPS लोकेशन प्राप्त करें',
    btn_live_camera: 'लाइव कैमरा',
    btn_record_voice: 'वॉयस रिकॉर्ड करें',
    placeholder_describe: 'अपनी समस्या का स्पष्ट विवरण दें (उदा: कानपुर में पानी की पाइपलाइन टूट गई है)...',
    btn_submit_complaint: 'शिकायत तुरंत जमा करें',

    // Auth Modal
    create_account: 'नागरिक खाता बनाएं',
    welcome_back: 'पुनः स्वागत है',
    signup_tab: 'नए उपयोगकर्ता (साइन अप)',
    login_tab: 'मौजूदा उपयोगकर्ता (लॉग इन)',
    full_name: 'पूरा नाम',
    email_address: 'ईमेल पता',
    phone_number: 'फोन नंबर',
    your_district: 'आपका जिला / क्षेत्र',
    password_label: 'पासवर्ड',
    create_btn: 'खाता बनाएं और जारी रखें',
    login_btn: 'खाते में लॉग इन करें',
    demo_login: 'एक क्लिक में त्वरित साइन इन करें (डेमो)',
  },

  ta: {
    // Nav & Sidebar
    nav_dashboard: 'டாஷ்போர்டு மேலோட்டம்',
    nav_copilot: 'AI உதவியாளரிடம் கேட்கவும்',
    nav_demand: 'குடிமக்கள் புகார்கள்',
    nav_feedback: 'சமூக சுவர்',
    nav_hotspots: 'பிரச்சனை மையங்கள்',
    nav_gaps: 'வசதி பற்றாக்குறை',
    nav_recommendations: 'முன்னுரிமை திட்டங்கள்',
    nav_evidence: 'சான்றுகள் & ஆதாரங்கள்',
    nav_scenarios: 'பட்ஜெட் சிமுலேட்டர்',
    nav_data: 'தரவை சமர்ப்பிக்கவும்',
    nav_raise_complaint: 'புகார் பதிவு செய்',
    nav_search: 'தேடு...',
    nav_signin: 'உள்நுழைக',

    // Sidebar Groups
    group_voices: 'குடிமக்கள் குரல் & AI',
    group_priorities: 'முன்னுரிமைகள் & பட்ஜெட்',
    group_data: 'அனைத்து தரவு அறிக்கைகள்',

    // Dashboard Overview
    dash_title: 'குடிமக்கள் தேவை & உள்கட்டமைப்பு மையம்',
    dash_subtitle: '35 பிஆர்டிசிஎஸ் மாவட்டங்களில் குடிமக்கள் கருத்துகளின் நிகழ்நேர பகுப்பாய்வு',
    stat_demands: 'சரிபார்க்கப்பட்ட தேவைகள்',
    stat_regions: 'கண்காணிக்கப்படும் பகுதிகள்',
    stat_deficits: 'உள்கட்டமைப்பு பற்றாக்குறை',
    stat_investments: 'மூலதன திட்டங்கள்',
    top_priorities_title: 'முன்னுரிமை உள்கட்டமைப்பு பரிந்துரைகள்',
    view_evidence: 'ஆதாரம் பார்',
    simulate_budget: 'பட்ஜெட் கணக்கிடு',

    // Hero Buttons
    btn_view_complaints: 'புகார்களைப் பார்க்கவும்',
    btn_citizen_voices: 'குடிமக்கள் குரல்',
    btn_budget_sim: 'பட்ஜெட் சிமுலேட்டர்',
    btn_problem_hotspots: 'பிரச்சனை மையங்கள்',

    // Metric Card Titles
    metric_total_complaints: 'மொத்த புகார்கள்',
    metric_districts_monitored: 'கண்காணிக்கப்படும் மாவட்டங்கள்',
    metric_facility_shortfalls: 'கண்டறியப்பட்ட பற்றாக்குறைகள்',
    metric_urgent_projects: 'முன்னுரிமை திட்டங்கள்',

    // Citizen Complaints Page
    demand_page_title: 'குடிமக்கள் புகார்கள் & போக்குகள்',
    signals_logged_label: 'பதிவு செய்யப்பட்டவை',
    studio_title: 'குடிமக்கள் குரல் ஸ்டுடியோ',
    studio_sub: 'உங்கள் கருத்துகளை தமிழ், இந்தி, தெலுங்கில் சமர்ப்பிக்கவும்.',
    target_region_label: 'இலக்கு பகுதி:',
    btn_region_details: 'பகுதி விவரங்கள்',
    try_signal_label: 'மாதிரி கோரிக்கையை முயற்சிக்கவும்:',
    placeholder_feedback: 'உங்கள் பிரச்சனையை எந்த மொழியிலும் தட்டச்சு செய்யவும்...',
    btn_analyze_signal: 'பகுப்பாய்வு செய்',
    complaints_title: 'குடிமக்கள் கோரிக்கைகள்',
    showing_verified: 'சரிபார்க்கப்பட்ட கோரிக்கைகள் காண்பிக்கப்படுகின்றன',
    translation_label: 'மொழிபெயர்ப்பு:',

    // Raise Complaint Modal
    raise_modal_title: 'உங்கள் புகாரைப் பதிவு செய்யவும்',
    raise_modal_sub: 'சாலை, குடிநீர் பிரச்சனைகளை நேரடியாக பதிவு செய்யவும்.',
    badge_verified_citizen: 'சரிபார்க்கப்பட்ட குடிமகன்',
    guest_banner_text: 'விருந்தினராக பதிவு செய்கிறீர்கள்',
    label_sector_category: 'துறை பிரிவு *',
    label_urgency_level: 'அவசர நிலை *',
    label_language: 'மொழி *',
    label_channel: 'சேவை வழி *',
    label_describe_problem: 'உங்கள் பிரச்சனையை விளக்கவும் *',
    label_live_location: 'நேரலை இருப்பிடம்',
    label_photo_evidence: 'புகைப்பட ஆதாரம்',
    btn_fetch_gps: 'GPS பெறவும்',
    btn_live_camera: 'நேரலை கேமரா',
    btn_record_voice: 'குரல் பதிவு',
    placeholder_describe: 'உங்கள் பிரச்சனையை தெளிவாக விளக்கவும்...',
    btn_submit_complaint: 'புகாரை உடனடியாக சமர்ப்பி',

    // Auth Modal
    create_account: 'குடிமகன் கணக்கை உருவாக்கவும்',
    welcome_back: 'மீண்டும் வருக',
    signup_tab: 'புதிய பயனர் (பதிவு செய்)',
    login_tab: 'உள்நுழைவு',
    full_name: 'முழு பெயர்',
    email_address: 'மின்னஞ்சல் முகவரி',
    phone_number: 'தொலைபேசி எண்',
    your_district: 'உங்கள் மாவட்டம்',
    password_label: 'கடவுச்சொல்',
    create_btn: 'கணக்கு உருவாக்கி தொடரவும்',
    login_btn: 'உள்நுழைக',
    demo_login: 'ஒரே கிளிக்கில் உள்நுழைக (டெமோ)',
  },

  mr: {
    // Nav & Sidebar
    nav_dashboard: 'डॅशबोर्ड विहंगावलोकन',
    nav_copilot: 'AI सहाय्यकाला विचारा',
    nav_demand: 'नागरिकांच्या तक्रारी',
    nav_feedback: 'सामाजिक मंच',
    nav_hotspots: 'समस्या हॉटस्पॉट',
    nav_gaps: 'सुविधांची कमतरता',
    nav_recommendations: 'सर्वोच्च प्राधान्य प्रकल्प',
    nav_evidence: 'पुरावे आणि साक्ष',
    nav_scenarios: 'बजेट सिम्युलेटर',
    nav_data: 'डेटा सादर करा',
    nav_raise_complaint: 'तक्रार नोंदवा',
    nav_search: 'शोधा...',
    nav_signin: 'साइन इन करा',

    // Sidebar Groups
    group_voices: 'नागरिक आवाज आणि AI',
    group_priorities: 'प्राधान्यक्रम आणि बजेट',
    group_data: 'सर्व डेटा आणि अहवाल',

    // Dashboard Overview
    dash_title: 'नागरी मागणी आणि पायाभूत सुविधा कॉकपिट',
    dash_subtitle: '35 बीआरआयसीएस जिल्ह्यांमधील बहुभाषिक नागरी अभिप्रायाचे थेट विश्लेषण',
    stat_demands: 'सत्यपित मागण्या',
    stat_regions: 'नियंत्रित क्षेत्रे',
    stat_deficits: 'पायाभूत सुविधांची तूट',
    stat_investments: 'भांडवली प्रकल्प',
    top_priorities_title: 'सर्वोच्च प्राधान्य पायाभूत सुविधा शिफारसी',
    view_evidence: 'पुरावा पहा',
    simulate_budget: 'बजेट सिम्युलेट करा',

    // Hero Buttons
    btn_view_complaints: 'तक्रारी पहा',
    btn_citizen_voices: 'नागरिक आवाज',
    btn_budget_sim: 'बजेट सिम्युलेटर',
    btn_problem_hotspots: 'समस्या हॉटस्पॉट',

    // Metric Card Titles
    metric_total_complaints: 'एकूण नोंदवलेल्या तक्रारी',
    metric_districts_monitored: 'नियंत्रित जिल्हे',
    metric_facility_shortfalls: 'आढळलेली सुविधांची तूट',
    metric_urgent_projects: 'तातडीचे प्राधान्य प्रकल्प',

    // Citizen Complaints Page
    demand_page_title: 'नागरिक तक्रारी आणि ट्रेंड',
    signals_logged_label: 'नोंदवलेले संकेत',
    studio_title: 'बहुभाषिक नागरिक आवाज स्टुडिओ',
    studio_sub: 'तुमची समस्या मराठी, हिंदी, इंग्रजीत सांगा.',
    target_region_label: 'लक्ष्य क्षेत्र:',
    btn_region_details: 'क्षेत्र तपशील',
    try_signal_label: 'समस्या उदाहरण पहा:',
    placeholder_feedback: 'तुमची समस्या कोणत्याही भाषेत येथे टाइप करा...',
    btn_analyze_signal: 'विश्लेषण करा',
    complaints_title: 'फिल्टर केलेल्या तक्रारी',
    showing_verified: 'सत्यापित मागण्या दाखवत आहे',
    translation_label: 'भाषांतर:',

    // Raise Complaint Modal
    raise_modal_title: 'तुमची तक्रार नोंदवा',
    raise_modal_sub: 'रस्त्यांची दुरवस्था, पाणीपुरवठा समस्या थेट नोंदवा.',
    badge_verified_citizen: 'सत्यापित नागरिक',
    guest_banner_text: 'अतिथी म्हणून नोंदवत आहात',
    label_sector_category: 'क्षेत्र श्रेणी *',
    label_urgency_level: 'तातडीची पातळी *',
    label_language: 'भाषा *',
    label_channel: 'माध्यम *',
    label_describe_problem: 'समस्या सविस्तर सांगा *',
    label_live_location: 'थेट स्थान',
    label_photo_evidence: 'फोटो पुरावा',
    btn_fetch_gps: 'GPS स्थान मिळवा',
    btn_live_camera: 'थेट कॅमेरा',
    btn_record_voice: 'व्हॉइस रेकॉर्ड करा',
    placeholder_describe: 'तुमची समस्या सविस्तर सांगा...',
    btn_submit_complaint: 'तक्रार तात्काळ सबमिट करा',

    // Auth Modal
    create_account: 'नागरी खाते तयार करा',
    welcome_back: 'पुन्हा स्वागत आहे',
    signup_tab: 'नवीन वापरकर्ता (साइन अप)',
    login_tab: 'अस्तित्वात असलेले वापरकर्ते',
    full_name: 'पूर्ण नाव',
    email_address: 'ईमेल पत्ता',
    phone_number: 'फोन नंबर',
    your_district: 'तुमचा जिल्हा / परिसर',
    password_label: 'पासवर्ड',
    create_btn: 'खाते तयार करा आणि पुढे जा',
    login_btn: 'लॉग इन करा',
    demo_login: 'एका क्लिकमध्ये साइन इन करा (डेमो)',
  },

  bn: {
    // Nav & Sidebar
    nav_dashboard: 'ড্যাশবোর্ড ডিরেক্টরি',
    nav_copilot: 'এআই সহকারীকে জিজ্ঞাসা করুন',
    nav_demand: 'নাগরিকের অভিযোগ',
    nav_feedback: 'কমিউনিটি ওয়াল',
    nav_hotspots: 'সমস্যা হটস্পট',
    nav_gaps: 'সুবিধার ঘাটতি',
    nav_recommendations: 'শীর্ষ অগ্রাধিকার প্রকল্প',
    nav_evidence: 'প্রমাণ এবং তথ্য',
    nav_scenarios: 'বাজেট সিমুলেটর',
    nav_data: 'ডেটা জমা দিন',
    nav_raise_complaint: 'অভিযোগ দায়ের করুন',
    nav_search: 'অনুসন্ধান করুন...',
    nav_signin: 'সাইন ইন করুন',

    // Sidebar Groups
    group_voices: 'নাগরিক কণ্ঠ ও এআই',
    group_priorities: 'অগ্রাধিকার ও বাজেট',
    group_data: 'সমস্ত ডেটা রিপোর্ট',

    // Dashboard Overview
    dash_title: 'নাগরিক চাহিদা ও পরিকাঠামো ককপিট',
    dash_subtitle: '৩৫টি ব্রিকস জেলায় রিয়েল-টাইম নাগরিক প্রতিক্রিয়া বিশ্লেষণ',
    stat_demands: 'যাচাইকৃত চাহিদা',
    stat_regions: 'পর্যবেক্ষিত অঞ্চল',
    stat_deficits: 'পরিকাঠামোর ঘাটতি',
    stat_investments: 'মূলধনী প্রকল্প',
    top_priorities_title: 'শীর্ষ অগ্রাধিকার পরিকাঠামো পরামর্শ',
    view_evidence: 'প্রমাণ দেখুন',
    simulate_budget: 'বাজেট সিমুলেট করুন',

    // Hero Buttons
    btn_view_complaints: 'অভিযোগ দেখুন',
    btn_citizen_voices: 'নাগরিক কণ্ঠ',
    btn_budget_sim: 'বাজেট সিমুলেটর',
    btn_problem_hotspots: 'সমস্যা হটস্পট',

    // Metric Card Titles
    metric_total_complaints: 'মোট অভিযোগ সংখ্যা',
    metric_districts_monitored: 'পর্যবেক্ষিত জেলা',
    metric_facility_shortfalls: 'চিহ্নিত ঘাটতি',
    metric_urgent_projects: 'জরুরী প্রকল্প',

    // Citizen Complaints Page
    demand_page_title: 'নাগরিক অভিযোগ ও প্রবণতা',
    signals_logged_label: 'নথিভুক্ত তথ্য',
    studio_title: 'নাগরিক ভয়েস স্টুডিও',
    studio_sub: 'বাংলা, হিন্দি, ইংরেজিতে আপনার সমস্যা জানান।',
    target_region_label: 'লক্ষ্য অঞ্চল:',
    btn_region_details: 'অঞ্চল বিবরণ',
    try_signal_label: 'নমুনা সমস্যা দেখুন:',
    placeholder_feedback: 'আপনার সমস্যা লিখুন...',
    btn_analyze_signal: 'বিশ্লেষণ করুন',
    complaints_title: 'ফিল্টারকৃত নাগরিক অভিযোগ',
    showing_verified: 'যাচাইকৃত চাহিদা দেখানো হচ্ছে',
    translation_label: 'অনুবাদ:',

    // Raise Complaint Modal
    raise_modal_title: 'আপনার অভিযোগ দায়ের করুন',
    raise_modal_sub: 'রাস্তা ও জলের সমস্যা সরাসরি জানান।',
    badge_verified_citizen: 'যাচাইকৃত নাগরিক',
    guest_banner_text: 'অতিথি হিসাবে জমা দিচ্ছেন',
    label_sector_category: 'বিভাগীয় বিভাগ *',
    label_urgency_level: 'জরুরী স্তর *',
    label_language: 'ভাষা *',
    label_channel: 'মাধ্যম *',
    label_describe_problem: 'সমস্যার বিবরণ দিন *',
    label_live_location: 'লাইভ অবস্থান',
    label_photo_evidence: 'ছবি প্রমাণ',
    btn_fetch_gps: 'জিপিএস নিন',
    btn_live_camera: 'লাইভ ক্যামেরা',
    btn_record_voice: 'ভয়েস রেকর্ড করুন',
    placeholder_describe: 'সমস্যার বিবরণ দিন...',
    btn_submit_complaint: 'অভিযোগ জমা দিন',

    // Auth Modal
    create_account: 'নাগরিক অ্যাকাউন্ট খুলুন',
    welcome_back: 'স্বাগতম',
    signup_tab: 'নতুন ব্যবহারকারী (সাইন আপ)',
    login_tab: 'লগ ইন করুন',
    full_name: 'সম্পূর্ণ নাম',
    email_address: 'ইমেল ঠিকানা',
    phone_number: 'ফোন নম্বর',
    your_district: 'আপনার জেলা / অঞ্চল',
    password_label: 'পাসওয়ার্ড',
    create_btn: 'অ্যাকাউন্ট তৈরি করুন',
    login_btn: 'লগ ইন করুন',
    demo_login: 'এক ক্লিকে লগ ইন করুন (ডেমো)',
  },
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('civicpulse_selected_language');
      if (saved && ['en', 'te', 'hi', 'ta', 'mr', 'bn'].includes(saved)) {
        return saved as SupportedLanguage;
      }
    } catch {
      // ignore
    }
    return 'en'; // Default is English
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('civicpulse_selected_language', lang);
    } catch {
      // ignore
    }
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
