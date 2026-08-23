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

    // Citizen Complaints
    complaints_title: 'Filtered Citizen Requests',
    showing_verified: 'Showing verified demand signals',
    translation_label: 'Translation:',

    // Raise Complaint Modal
    raise_modal_title: 'Raise Your Complaint',
    raise_modal_sub: 'Report broken infrastructure, service outages, or local civic issues directly to priority models.',
    sector_category: 'Sector Category',
    urgency_level: 'Urgency Level',
    language_label: 'Language',
    channel_label: 'Channel',
    describe_problem: 'Describe Your Problem in Detail',
    record_voice: 'Record Voice Note',
    live_location: 'Live Location',
    fetch_gps: 'Fetch GPS',
    photo_evidence: 'Photo Evidence',
    live_camera: 'Live Camera',
    upload_file: 'Upload',
    submit_complaint: 'Fast-Track & Submit Civic Complaint',

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
    dash_title: 'సివిక్ డిమాండ్ ఇంటెలిజెన్స్ & ఇన్ఫ్రాస్ట్రక్చర్ కాక్‌పిట్',
    dash_subtitle: '35 BRICS జిల్లాల నుండి పౌరుల బహుభాషా అభిప్రాయాల రియల్ టైమ్ విశ్లేషణ',
    stat_demands: 'ధృవీకరించబడిన డిమాండ్లు',
    stat_regions: 'పర్యవేక్షించబడుతున్న ప్రాంతాలు',
    stat_deficits: 'మౌలిక సదుపాయాల కొరత',
    stat_investments: 'మూలధన ప్రాజెక్ట్‌లు',
    top_priorities_title: 'అగ్ర ప్రాధాన్యత మౌలిక సదుపాయాల సిఫార్సులు',
    view_evidence: 'సాక్ష్యం చూడండి',
    simulate_budget: 'బడ్జెట్ సిమ్యులేట్ చేయండి',

    // Citizen Complaints
    complaints_title: 'ఫిల్టర్ చేసిన పౌరుల అభ్యర్థనలు',
    showing_verified: 'ధృవీకరించబడిన డిమాండ్ సంకేతాలను చూపుతోంది',
    translation_label: 'అనువాదం:',

    // Raise Complaint Modal
    raise_modal_title: 'మీ ఫిర్యాదును నమోదు చేయండి',
    raise_modal_sub: 'పాడైపోయిన రోడ్లు, నీటి కొరత, విద్యుత్ సమస్యలను నేరుగా నమోదు చేయండి.',
    sector_category: 'సమస్య విభాగం',
    urgency_level: 'అత్యవసర స్థాయి',
    language_label: 'భాష',
    channel_label: 'మాధ్యమం',
    describe_problem: 'మీ సమస్యను వివరంగా వివరించండి',
    record_voice: 'వాయిస్ నోట్ రికార్డ్ చేయండి',
    live_location: 'లైవ్ లొకేషన్',
    fetch_gps: 'GPS లొకేషన్ తీసుకోండి',
    photo_evidence: 'ఫోటో ఆధారం',
    live_camera: 'లైవ్ కెమెరా',
    upload_file: 'అప్‌లోడ్',
    submit_complaint: 'ఫిర్యాదును వేగవంతంగా సమర్పించండి',

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

    // Citizen Complaints
    complaints_title: 'फ़िल्टर की गई नागरिक शिकायतें',
    showing_verified: 'सत्यापित मांग संकेतों को दिखाया जा रहा है',
    translation_label: 'अनुवाद:',

    // Raise Complaint Modal
    raise_modal_title: 'अपनी शिकायत दर्ज करें',
    raise_modal_sub: 'टूटी हुई सड़कों, पानी की आपूर्ति, या बिजली की समस्या को सीधे दर्ज करें।',
    sector_category: 'क्षेत्र श्रेणी',
    urgency_level: 'अत्यावश्यकता स्तर',
    language_label: 'भाषा',
    channel_label: 'माध्यम',
    describe_problem: 'अपनी समस्या का विवरण दें',
    record_voice: 'वॉयस नोट रिकॉर्ड करें',
    live_location: 'लाइव लोकेशन',
    fetch_gps: 'GPS लोकेशन प्राप्त करें',
    photo_evidence: 'फोटो साक्ष्य',
    live_camera: 'लाइव कैमरा',
    upload_file: 'अपलोड करें',
    submit_complaint: 'शिकायत तुरंत जमा करें',

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

    // Citizen Complaints
    complaints_title: 'குடிமக்கள் கோரிக்கைகள்',
    showing_verified: 'சரிபார்க்கப்பட்ட கோரிக்கைகள் காண்பிக்கப்படுகின்றன',
    translation_label: 'மொழிபெயர்ப்பு:',

    // Raise Complaint Modal
    raise_modal_title: 'உங்கள் புகாரைப் பதிவு செய்யவும்',
    raise_modal_sub: 'பழுதடைந்த சாலைகள், குடிநீர் பற்றாக்குறையை நேரடியாக பதிவு செய்யுங்கள்.',
    sector_category: 'துறை பிரிவு',
    urgency_level: 'அவசர நிலை',
    language_label: 'மொழி',
    channel_label: 'சேவை வழி',
    describe_problem: 'உங்கள் பிரச்சனையை விளக்கவும்',
    record_voice: 'குரல் பதிவு செய்',
    live_location: 'நேரலை இருப்பிடம்',
    fetch_gps: 'GPS பெறவும்',
    photo_evidence: 'புகைப்பட ஆதாரம்',
    live_camera: 'நேரலை கேமரா',
    upload_file: 'பதிவேற்று',
    submit_complaint: 'புகாரை உடனடியாக சமர்ப்பி',

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

    // Citizen Complaints
    complaints_title: 'फिल्टर केलेल्या तक्रारी',
    showing_verified: 'सत्यापित मागण्या दाखवत आहे',
    translation_label: 'भाषांतर:',

    // Raise Complaint Modal
    raise_modal_title: 'तुमची तक्रार नोंदवा',
    raise_modal_sub: 'रस्त्यांची दुरवस्था, पाणीपुरवठा किंवा विजेच्या समस्या थेट नोंदवा.',
    sector_category: 'क्षेत्र श्रेणी',
    urgency_level: 'तातडीची पातळी',
    language_label: 'भाषा',
    channel_label: 'माध्यम',
    describe_problem: 'तुमची समस्या सविस्तर सांगा',
    record_voice: 'व्हॉइस टीप रेकॉर्ड करा',
    live_location: 'थेट स्थान',
    fetch_gps: 'GPS स्थान मिळवा',
    photo_evidence: 'फोटो पुरावा',
    live_camera: 'थेट कॅमेरा',
    upload_file: 'अपलोड करा',
    submit_complaint: 'तक्रार तात्काळ सबमिट करा',

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

    // Citizen Complaints
    complaints_title: 'ফিল্টারকৃত নাগরিক অভিযোগ',
    showing_verified: 'যাচাইকৃত চাহিদা দেখানো হচ্ছে',
    translation_label: 'অনুবাদ:',

    // Raise Complaint Modal
    raise_modal_title: 'আপনার অভিযোগ দায়ের করুন',
    raise_modal_sub: 'ভাঙা রাস্তা, পানীয় জলের সমস্যা বা বিদ্যুতের ঘাটতি সরাসরি জানান।',
    sector_category: 'বিভাগীয় বিভাগ',
    urgency_level: 'জরুরী স্তর',
    language_label: 'ভাষা',
    channel_label: 'মাধ্যম',
    describe_problem: 'আপনার সমস্যা বিস্তারিত বলুন',
    record_voice: 'ভয়েস নোট রেকর্ড করুন',
    live_location: 'লাইভ অবস্থান',
    fetch_gps: 'জিপিএস অবস্থান নিন',
    photo_evidence: 'ছবি প্রমাণ',
    live_camera: 'লাইভ ক্যামেরা',
    upload_file: 'আপলোড করুন',
    submit_complaint: 'অভিযোগ দ্রুত জমা দিন',

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
