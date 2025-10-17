import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'es' | 'hi' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Get saved language from localStorage or default to English
    const saved = localStorage.getItem('civic-app-language') as Language;
    return saved || 'en';
  });

  useEffect(() => {
    // Save language preference
    localStorage.setItem('civic-app-language', language);
  }, [language]);

  const t = (key: string): string => {
    const translations = getTranslations(language);
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation helper
const getTranslations = (lang: Language): Record<string, string> => {
  const translations: Record<Language, Record<string, string>> = {
    en: {
      // Header
      'app.title': 'Civic Reporter',
      'app.subtitle': 'Making Our City Better',
      'nav.notifications': 'Notifications',
      'nav.profile': 'Profile',
      'nav.logout': 'Log out',
      'nav.help': 'Help',
      'nav.language': 'Language',
      
      // Dashboard
      'dashboard.welcome': 'Welcome to Your Dashboard',
      'dashboard.subtitle': 'Track your civic issue reports and see real-time updates on their progress',
      'dashboard.overview': 'Dashboard Overview',
      'dashboard.reportNew': 'Report New Issue',
      
      // Stats
      'stats.total': 'Total Reports',
      'stats.resolved': 'Resolved',
      'stats.inProgress': 'In Progress',
      'stats.pending': 'Pending',
      
      // Tabs
      'tabs.myReports': 'My Reports',
      'tabs.mapView': 'Map View',
      
      // My Reports
      'reports.title': 'My Reports',
      'reports.subtitle': 'Track the status of all your submitted civic issue reports',
      'reports.all': 'All',
      'reports.resolved': 'Resolved',
      'reports.inProgress': 'In Progress',
      'reports.pending': 'Pending',
      'reports.empty': "You haven't submitted any reports yet.",
      'reports.noResolved': 'No resolved reports yet.',
      'reports.noInProgress': 'No reports in progress.',
      'reports.noPending': 'No pending reports.',
      'reports.people': 'people',
      'reports.person': 'person',
      'reports.reported': 'reported',
      
      // Report Form
      'form.title': 'Report a New Civic Issue',
      'form.description': 'Submit details about a civic problem in your area. Include photos and location for faster resolution.',
      'form.uploadImage': 'Upload Image',
      'form.clickUpload': 'Click to upload image',
      'form.imageFormat': 'PNG, JPG up to 10MB',
      'form.remove': 'Remove',
      'form.issueTitle': 'Issue Title',
      'form.issueTitlePlaceholder': 'Brief description of the issue',
      'form.detailedDescription': 'Detailed Description',
      'form.descriptionPlaceholder': 'Provide detailed information about the issue...',
      'form.category': 'Category',
      'form.categoryPlaceholder': 'Select issue category',
      'form.location': 'Location',
      'form.locationPlaceholder': 'Enter address or get current location',
      'form.useCurrentLocation': 'Use Current',
      'form.gettingLocation': 'Getting...',
      'form.cancel': 'Cancel',
      'form.submit': 'Submit Report',
      
      // Categories
      'category.potholes': 'Potholes',
      'category.streetlight': 'Street Light',
      'category.drainage': 'Drainage',
      'category.garbage': 'Garbage Collection',
      'category.waterSupply': 'Water Supply',
      'category.roadDamage': 'Road Damage',
      'category.parkMaintenance': 'Park Maintenance',
      'category.other': 'Other',
      
      // Similar Report
      'similar.title': 'Similar Report Found',
      'similar.description': 'We found an existing report that might be the same issue. Please confirm if this is the same problem.',
      'similar.alert': 'We found a similar report in the system. Is this the same issue?',
      'similar.reportedBy': 'people have reported this',
      'similar.submitNew': 'No, Submit New Report',
      'similar.sameIssue': 'Yes, Same Issue',
      
      // Map View
      'map.title': 'Area Map View',
      'map.subtitle': 'Click on markers to view report details',
      'map.legend': 'Map Legend',
      'map.highPriority': 'High Priority (10+ reports)',
      'map.mediumPriority': 'Medium Priority (5-9 reports)',
      'map.lowPriority': 'Low Priority (<5 reports)',
      'map.inProgress': 'In Progress',
      'map.activeReports': 'Active Reports',
      
      // Report Details
      'details.title': 'Detailed information about this civic issue report',
      'details.reportedIssue': 'Reported Issue',
      'details.description': 'Description',
      'details.location': 'Location',
      'details.submittedOn': 'Submitted On',
      'details.totalReports': 'Total Reports',
      'details.submittedBy': 'Submitted By',
      'details.resolution': 'Resolution Details',
      'details.completedOn': 'Completed on',
      'details.afterCompletion': 'After Completion',
      'details.financialTransparency': 'Financial Transparency',
      'details.sanctionedAmount': 'Sanctioned Amount',
      'details.amountUsed': 'Amount Used',
      'details.savings': 'Savings',
      'details.usageBreakdown': 'Usage Breakdown',
      'details.progressUpdate': 'Progress Update',
      'details.expectedCompletion': 'Expected completion',
      'details.progressPhotos': 'Progress Photos',
      'details.pendingReview': 'Pending Review',
      'details.pendingMessage': 'This report is currently under review by the municipal authorities.',
      'details.estimatedReview': 'Estimated review completion',
      
      // Toast Messages
      'toast.locationSuccess': 'Location captured successfully',
      'toast.locationError': 'Failed to get location. Please enter manually.',
      'toast.geolocationNotSupported': 'Geolocation is not supported by your browser',
      'toast.uploadImage': 'Please upload an image of the issue',
      'toast.reportSubmitted': 'Report submitted successfully!',
      'toast.reportAdded': 'Your report has been added to the existing case!',
      
      // Footer
      'footer.copyright': '© 2025 Civic Reporter. Making our community better, together.',
      'footer.about': 'About',
      'footer.privacy': 'Privacy Policy',
      'footer.terms': 'Terms of Service',
      'footer.contact': 'Contact',
      
      // Help
      'help.title': 'How to Use Civic Reporter',
      'help.gettingStarted': 'Getting Started',
      'help.step1': 'Step 1: Report an Issue',
      'help.step1desc': 'Click the "Report New Issue" button to submit a civic problem. Upload a photo, add details, and select the location.',
      'help.step2': 'Step 2: Track Your Reports',
      'help.step2desc': 'View all your submitted reports in the "My Reports" tab. Reports are categorized by status: Pending, In Progress, and Resolved.',
      'help.step3': 'Step 3: View on Map',
      'help.step3desc': 'Use the "Map View" tab to see all civic issues in your area. Color-coded markers show priority levels.',
      'help.features': 'Key Features',
      'help.feature1': 'Duplicate Detection',
      'help.feature1desc': 'The system automatically checks for similar reports to avoid duplicates and strengthen existing cases.',
      'help.feature2': 'Progress Tracking',
      'help.feature2desc': 'Get real-time updates on report status with photos and estimated completion dates.',
      'help.feature3': 'Financial Transparency',
      'help.feature3desc': 'View detailed financial information for resolved issues including sanctioned amounts and actual usage.',
      'help.markerColors': 'Map Marker Colors',
      'help.red': 'Red: High priority (10+ complaints)',
      'help.yellow': 'Yellow: Medium priority (5-9 complaints)',
      'help.blue': 'Blue: Low priority (<5 complaints)',
      'help.green': 'Green: Work in progress',
    },
    es: {
      // Header
      'app.title': 'Reportador Cívico',
      'app.subtitle': 'Mejorando Nuestra Ciudad',
      'nav.notifications': 'Notificaciones',
      'nav.profile': 'Perfil',
      'nav.logout': 'Cerrar sesión',
      'nav.help': 'Ayuda',
      'nav.language': 'Idioma',
      
      // Dashboard
      'dashboard.welcome': 'Bienvenido a tu Panel',
      'dashboard.subtitle': 'Rastrea tus reportes de problemas cívicos y ve actualizaciones en tiempo real',
      'dashboard.overview': 'Resumen del Panel',
      'dashboard.reportNew': 'Reportar Nuevo Problema',
      
      // Stats
      'stats.total': 'Total de Reportes',
      'stats.resolved': 'Resueltos',
      'stats.inProgress': 'En Progreso',
      'stats.pending': 'Pendientes',
      
      // Tabs
      'tabs.myReports': 'Mis Reportes',
      'tabs.mapView': 'Vista de Mapa',
      
      // My Reports
      'reports.title': 'Mis Reportes',
      'reports.subtitle': 'Rastrea el estado de todos tus reportes de problemas cívicos',
      'reports.all': 'Todos',
      'reports.resolved': 'Resueltos',
      'reports.inProgress': 'En Progreso',
      'reports.pending': 'Pendientes',
      'reports.empty': 'No has enviado ningún reporte todavía.',
      'reports.noResolved': 'No hay reportes resueltos todavía.',
      'reports.noInProgress': 'No hay reportes en progreso.',
      'reports.noPending': 'No hay reportes pendientes.',
      'reports.people': 'personas',
      'reports.person': 'persona',
      'reports.reported': 'reportaron',
      
      // Report Form
      'form.title': 'Reportar un Nuevo Problema Cívico',
      'form.description': 'Envía detalles sobre un problema cívico en tu área. Incluye fotos y ubicación para una resolución más rápida.',
      'form.uploadImage': 'Subir Imagen',
      'form.clickUpload': 'Haz clic para subir imagen',
      'form.imageFormat': 'PNG, JPG hasta 10MB',
      'form.remove': 'Eliminar',
      'form.issueTitle': 'Título del Problema',
      'form.issueTitlePlaceholder': 'Breve descripción del problema',
      'form.detailedDescription': 'Descripción Detallada',
      'form.descriptionPlaceholder': 'Proporciona información detallada sobre el problema...',
      'form.category': 'Categoría',
      'form.categoryPlaceholder': 'Selecciona categoría del problema',
      'form.location': 'Ubicación',
      'form.locationPlaceholder': 'Ingresa dirección u obtén ubicación actual',
      'form.useCurrentLocation': 'Usar Actual',
      'form.gettingLocation': 'Obteniendo...',
      'form.cancel': 'Cancelar',
      'form.submit': 'Enviar Reporte',
      
      // Categories
      'category.potholes': 'Baches',
      'category.streetlight': 'Luz de Calle',
      'category.drainage': 'Drenaje',
      'category.garbage': 'Recolección de Basura',
      'category.waterSupply': 'Suministro de Agua',
      'category.roadDamage': 'Daño en Carretera',
      'category.parkMaintenance': 'Mantenimiento de Parque',
      'category.other': 'Otro',
      
      // Similar Report
      'similar.title': 'Reporte Similar Encontrado',
      'similar.description': 'Encontramos un reporte existente que podría ser el mismo problema. Confirma si es el mismo problema.',
      'similar.alert': 'Encontramos un reporte similar en el sistema. ¿Es el mismo problema?',
      'similar.reportedBy': 'personas han reportado esto',
      'similar.submitNew': 'No, Enviar Nuevo Reporte',
      'similar.sameIssue': 'Sí, Mismo Problema',
      
      // Map View
      'map.title': 'Vista de Mapa del Área',
      'map.subtitle': 'Haz clic en los marcadores para ver detalles del reporte',
      'map.legend': 'Leyenda del Mapa',
      'map.highPriority': 'Alta Prioridad (10+ reportes)',
      'map.mediumPriority': 'Prioridad Media (5-9 reportes)',
      'map.lowPriority': 'Baja Prioridad (<5 reportes)',
      'map.inProgress': 'En Progreso',
      'map.activeReports': 'Reportes Activos',
      
      // Toast Messages
      'toast.locationSuccess': 'Ubicación capturada exitosamente',
      'toast.locationError': 'Error al obtener ubicación. Por favor ingresa manualmente.',
      'toast.geolocationNotSupported': 'La geolocalización no es compatible con tu navegador',
      'toast.uploadImage': 'Por favor sube una imagen del problema',
      'toast.reportSubmitted': '¡Reporte enviado exitosamente!',
      'toast.reportAdded': '¡Tu reporte ha sido agregado al caso existente!',
      
      // Footer
      'footer.copyright': '© 2025 Reportador Cívico. Mejorando nuestra comunidad, juntos.',
      'footer.about': 'Acerca de',
      'footer.privacy': 'Política de Privacidad',
      'footer.terms': 'Términos de Servicio',
      'footer.contact': 'Contacto',
      
      // Help
      'help.title': 'Cómo Usar Reportador Cívico',
      'help.gettingStarted': 'Comenzando',
      'help.step1': 'Paso 1: Reportar un Problema',
      'help.step1desc': 'Haz clic en el botón "Reportar Nuevo Problema" para enviar un problema cívico. Sube una foto, agrega detalles y selecciona la ubicación.',
      'help.step2': 'Paso 2: Rastrea tus Reportes',
      'help.step2desc': 'Ve todos tus reportes enviados en la pestaña "Mis Reportes". Los reportes están categorizados por estado: Pendientes, En Progreso y Resueltos.',
      'help.step3': 'Paso 3: Ver en el Mapa',
      'help.step3desc': 'Usa la pestaña "Vista de Mapa" para ver todos los problemas cívicos en tu área. Los marcadores codificados por colores muestran niveles de prioridad.',
      'help.features': 'Características Principales',
      'help.feature1': 'Detección de Duplicados',
      'help.feature1desc': 'El sistema verifica automáticamente reportes similares para evitar duplicados y fortalecer casos existentes.',
      'help.feature2': 'Seguimiento de Progreso',
      'help.feature2desc': 'Obtén actualizaciones en tiempo real sobre el estado del reporte con fotos y fechas estimadas de finalización.',
      'help.feature3': 'Transparencia Financiera',
      'help.feature3desc': 'Ve información financiera detallada para problemas resueltos incluyendo montos sancionados y uso real.',
      'help.markerColors': 'Colores de Marcadores del Mapa',
      'help.red': 'Rojo: Alta prioridad (10+ quejas)',
      'help.yellow': 'Amarillo: Prioridad media (5-9 quejas)',
      'help.blue': 'Azul: Baja prioridad (<5 quejas)',
      'help.green': 'Verde: Trabajo en progreso',
    },
    hi: {
      // Header
      'app.title': 'नागरिक रिपोर्टर',
      'app.subtitle': 'हमारे शहर को बेहतर बनाना',
      'nav.notifications': 'सूचनाएं',
      'nav.profile': 'प्रोफ़ाइल',
      'nav.logout': 'लॉग आउट',
      'nav.help': 'मदद',
      'nav.language': 'भाषा',
      
      // Dashboard
      'dashboard.welcome': 'आपके डैशबोर्ड में आपका स्वागत है',
      'dashboard.subtitle': 'अपनी नागरिक समस्या रिपोर्ट को ट्रैक करें और वास्तविक समय अपडेट देखें',
      'dashboard.overview': 'डैशबोर्ड अवलोकन',
      'dashboard.reportNew': 'नई समस्या रिपोर्ट करें',
      
      // Stats
      'stats.total': 'क��ल रिपोर्ट',
      'stats.resolved': 'हल हो गए',
      'stats.inProgress': 'प्रगति में',
      'stats.pending': 'लंबित',
      
      // Tabs
      'tabs.myReports': 'मेरी रिपोर्ट',
      'tabs.mapView': 'मानचित्र दृश्य',
      
      // My Reports
      'reports.title': 'मेरी रिपोर्ट',
      'reports.subtitle': 'अपनी सभी सबमिट की गई नागरिक समस्या रिपोर्ट की स्थिति ट्रैक करें',
      'reports.all': 'सभी',
      'reports.resolved': 'हल हो गए',
      'reports.inProgress': 'प्रगति में',
      'reports.pending': 'लंबित',
      'reports.empty': 'आपने अभी तक कोई रिपोर्ट सबमिट नहीं की है।',
      'reports.noResolved': 'अभी तक कोई हल रिपोर्ट नहीं।',
      'reports.noInProgress': 'कोई प्रगति में रिपोर्ट नहीं।',
      'reports.noPending': 'कोई लंबित रिपोर्ट नहीं।',
      'reports.people': 'लोग',
      'reports.person': 'व्यक्ति',
      'reports.reported': 'रिपोर्ट किया',
      
      // Report Form
      'form.title': 'एक नई नागरिक समस्या रिपोर्ट करें',
      'form.description': 'अपने क्षेत्र में नागरिक समस्या के बारे में विवरण सबमिट करें। तेज़ समाधान के लिए फ़ोटो और स्थान शामिल करें।',
      'form.uploadImage': 'छवि अपलोड करें',
      'form.clickUpload': 'छवि अपलोड करने के लिए क्लिक करें',
      'form.imageFormat': 'PNG, JPG 10MB तक',
      'form.remove': 'हटाएं',
      'form.issueTitle': 'समस्या शीर्षक',
      'form.issueTitlePlaceholder': 'समस्या का संक्षिप्त विवरण',
      'form.detailedDescription': 'विस्तृत विवरण',
      'form.descriptionPlaceholder': 'समस्या के बारे में विस्तृत जानकारी प्रदान करें...',
      'form.category': 'श्रेणी',
      'form.categoryPlaceholder': 'समस्या श्रेणी चुनें',
      'form.location': 'स्थान',
      'form.locationPlaceholder': 'पता दर्ज करें या वर्तमान स्थान प्राप्त करें',
      'form.useCurrentLocation': 'वर्तमान उपयोग करें',
      'form.gettingLocation': 'प्राप्त कर रहे हैं...',
      'form.cancel': 'रद्द करें',
      'form.submit': 'रिपोर्ट सबमिट करें',
      
      // Categories
      'category.potholes': 'गड्ढे',
      'category.streetlight': 'सड़क की रोशनी',
      'category.drainage': 'जल निकासी',
      'category.garbage': 'कचरा संग्रहण',
      'category.waterSupply': 'जल आपूर्ति',
      'category.roadDamage': 'सड़क क्षति',
      'category.parkMaintenance': 'पार्क रखरखाव',
      'category.other': 'अन्य',
      
      // Similar Report
      'similar.title': 'समान रिपोर्ट मिली',
      'similar.description': 'हमें एक मौजूदा रिपोर्ट मिली जो समान समस्या हो सकती है। कृपया पुष्टि करें कि क्या यह समान समस्या है।',
      'similar.alert': 'हमें सिस्टम में एक समान रिपोर्ट मिली। क्या यह समान समस्या है?',
      'similar.reportedBy': 'लोगों ने इसकी रिपोर्ट की है',
      'similar.submitNew': 'नहीं, नई रिपोर्ट सबमिट करें',
      'similar.sameIssue': 'हां, समान समस्या',
      
      // Map View
      'map.title': 'क्षेत्र मानचित्र दृश्य',
      'map.subtitle': 'रिपोर्ट विवरण देखने के लिए मार्कर पर क्लिक करें',
      'map.legend': 'मानचित्र किंवदंती',
      'map.highPriority': 'उच्च प्राथमिकता (10+ रिपोर्ट)',
      'map.mediumPriority': 'मध्यम प्राथमिकता (5-9 रिपोर्ट)',
      'map.lowPriority': 'कम प्राथमिकता (<5 रिपोर्ट)',
      'map.inProgress': 'प्रगति में',
      'map.activeReports': 'सक्रिय रिपोर्ट',
      
      // Toast Messages
      'toast.locationSuccess': 'स्थान सफलतापूर्वक कैप्चर किया गया',
      'toast.locationError': 'स्थान प्राप्त करने में विफल। कृपया मैन्युअल रूप से दर्ज करें।',
      'toast.geolocationNotSupported': 'आपके ब्राउज़र द्वारा जियोलोकेशन समर्थित नहीं है',
      'toast.uploadImage': 'कृपया समस्या की एक छवि अपलोड करें',
      'toast.reportSubmitted': 'रिपोर्ट सफलतापूर्वक सबमिट की गई!',
      'toast.reportAdded': 'आपकी रिपोर्ट मौजूदा केस में जोड़ दी गई है!',
      
      // Footer
      'footer.copyright': '© 2025 नागरिक रिपोर्टर। हमारे समुदाय को बेहतर बनाना, साथ में।',
      'footer.about': 'के बारे में',
      'footer.privacy': 'गोपनीयता नीति',
      'footer.terms': 'सेवा की शर्तें',
      'footer.contact': 'संपर्क',
      
      // Help
      'help.title': 'नागरिक रिपोर्टर का उपयोग कैसे करें',
      'help.gettingStarted': 'शुरू करना',
      'help.step1': 'चरण 1: समस्या रिपोर्ट करें',
      'help.step1desc': 'नागरिक समस्या सबमिट करने के लिए "नई समस्या रिपोर्ट करें" बटन पर क्लिक करें। फोटो अपलोड करें, विवरण जोड़ें और स्थान चुनें।',
      'help.step2': 'चरण 2: अपनी रिपोर्ट ट्रैक करें',
      'help.step2desc': '"मेरी रिपोर्ट" टैब में अपनी सभी सबमिट की गई रिपोर्ट देखें। रिपोर्ट स्थिति द्वारा वर्गीकृत हैं: लंबित, प्रगति में, और हल हो गए।',
      'help.step3': 'चरण 3: मानचित्र पर देखें',
      'help.step3desc': 'अपने क्षेत्र में सभी नागरिक समस्याओं को देखने के लिए "मानचित्र दृश्य" टैब का उपयोग करें। रंग-कोडित मार्कर प्राथमिकता स्तर दिखाते हैं।',
      'help.features': 'मुख्य विशेषताएं',
      'help.feature1': 'डुप्लिकेट डिटेक्शन',
      'help.feature1desc': 'सिस्टम डुप्लिकेट से बचने और मौजूदा मामलों को मजबूत करने के लिए स्वचालित रूप से समान रिपोर्ट की जांच करता है।',
      'help.feature2': 'प्रगति ट्रैकिंग',
      'help.feature2desc': 'फोटो और अनुमानित पूर्णता तिथियों के साथ रिपोर्ट स्थिति पर वास्तविक समय अपडेट प्राप्त करें।',
      'help.feature3': 'वित्तीय पारदर्शिता',
      'help.feature3desc': 'स्वीकृत राशि और वास्तविक उपयोग सहित हल की गई समस्याओं के लिए विस्तृत वित्तीय जानकारी देखें।',
      'help.markerColors': 'मानचित्र मार्कर रंग',
      'help.red': 'लाल: उच्च प्राथमिकता (10+ शिकायतें)',
      'help.yellow': 'पीला: मध्यम प्राथमिकता (5-9 शिकायतें)',
      'help.blue': 'नीला: कम प्राथमिकता (<5 शिकायतें)',
      'help.green': 'हरा: काम प्रगति में',
    },
    fr: {
      // Header
      'app.title': 'Rapporteur Civique',
      'app.subtitle': 'Améliorer Notre Ville',
      'nav.notifications': 'Notifications',
      'nav.profile': 'Profil',
      'nav.logout': 'Se déconnecter',
      'nav.help': 'Aide',
      'nav.language': 'Langue',
      
      // Dashboard
      'dashboard.welcome': 'Bienvenue sur votre tableau de bord',
      'dashboard.subtitle': 'Suivez vos rapports de problèmes civiques et consultez les mises à jour en temps réel',
      'dashboard.overview': 'Aperçu du tableau de bord',
      'dashboard.reportNew': 'Signaler un nouveau problème',
      
      // Stats
      'stats.total': 'Total des rapports',
      'stats.resolved': 'Résolus',
      'stats.inProgress': 'En cours',
      'stats.pending': 'En attente',
      
      // Tabs
      'tabs.myReports': 'Mes rapports',
      'tabs.mapView': 'Vue de la carte',
      
      // Footer
      'footer.copyright': '© 2025 Rapporteur Civique. Améliorer notre communauté, ensemble.',
      'footer.about': 'À propos',
      'footer.privacy': 'Politique de confidentialité',
      'footer.terms': 'Conditions d\'utilisation',
      'footer.contact': 'Contact',
      
      // Help
      'help.title': 'Comment utiliser Rapporteur Civique',
    },
  };

  return translations[lang] || translations.en;
};
