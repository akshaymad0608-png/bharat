
import React from 'react';
import { 
  FileText, 
  FileImage, 
  Film, 
  FileSpreadsheet, 
  Zap,
  ShieldCheck,
  Cloud,
  Trash2,
  Smartphone,
  Cpu,
  Music,
  Archive,
  Code
} from 'lucide-react';
import { ConversionType, FaqItem, PricePlan } from './types';

export const TRANSLATIONS = {
  EN: {
    heroTitle: "Convert Any File in Seconds",
    heroSub: "Fast • Secure • Free • No Sign-up Required. The most powerful online file converter, built for the modern world.",
    ctaUpload: "Upload & Convert Now",
    ctaViewAll: "View All 200+ Converters",
    featuresTitle: "Why Choose ConvertBharat?",
    pricingTitle: "Simple, Transparent Pricing",
    pricingSub: "Start free, upgrade when you need power",
    faqTitle: "Frequently Asked Questions",
    footerDesc: "Empowering millions with fast, secure, and smart file conversions. Built in India for the global audience.",
    uploadStatus: "Choose a file or drag & drop",
    uploadProcessing: "Processing with AI magic...",
    uploadComplete: "Conversion Successful!",
    downloadBtn: "Download Result",
    convertAnother: "Convert Another"
  },
  HI: {
    heroTitle: "किसी भी फ़ाइल को सेकंडों में बदलें",
    heroSub: "तेज़ • सुरक्षित • मुफ़्त • कोई साइन-अप आवश्यक नहीं। आधुनिक दुनिया के लिए बनाया गया सबसे शक्तिशाली ऑनलाइन फ़ाइल कनवर्टर।",
    ctaUpload: "अभी अपलोड और कन्वर्ट करें",
    ctaViewAll: "सभी 200+ कन्वर्टर्स देखें",
    featuresTitle: "ConvertBharat क्यों चुनें?",
    pricingTitle: "सरल और पारदर्शी मूल्य निर्धारण",
    pricingSub: "मुफ़्त में शुरू करें, ज़रूरत पड़ने पर अपग्रेड करें",
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    footerDesc: "लाखों लोगों को तेज़, सुरक्षित और स्मार्ट फ़ाइल रूपांतरण के साथ सशक्त बनाना। वैश्विक दर्शकों के लिए भारत में निर्मित।",
    uploadStatus: "फ़ाइल चुनें या यहाँ खींचें",
    uploadProcessing: "AI जादू के साथ प्रोसेसिंग हो रही है...",
    uploadComplete: "रूपांतरण सफल रहा!",
    downloadBtn: "परिणाम डाउनलोड करें",
    convertAnother: "दूसरा कन्वर्ट करें"
  }
};

export const CONVERSIONS: ConversionType[] = [
  { id: 'p2w', name: 'PDF to Word', icon: <FileText className="w-5 h-5" />, category: 'Document' },
  { id: 'w2p', name: 'Word to PDF', icon: <FileText className="w-5 h-5" />, category: 'Document' },
  { id: 'p2csv', name: 'PDF to CSV', icon: <FileSpreadsheet className="w-5 h-5" />, category: 'Document' },
  { id: 'csv2e', name: 'CSV to Excel', icon: <FileSpreadsheet className="w-5 h-5" />, category: 'Document' },
  { id: 'j2p', name: 'JPG to PNG', icon: <FileImage className="w-5 h-5" />, category: 'Image' },
  { id: 'p2j', name: 'PNG to JPG', icon: <FileImage className="w-5 h-5" />, category: 'Image' },
  { id: 'i2pdf', name: 'Image to PDF', icon: <FileImage className="w-5 h-5" />, category: 'Image' },
  { id: 'mp42mp3', name: 'MP4 to MP3', icon: <Film className="w-5 h-5" />, category: 'Media' },
];

export const ALL_CONVERSIONS: ConversionType[] = [
  ...CONVERSIONS,
  { id: 'txt2pdf', name: 'TXT to PDF', icon: <FileText className="w-5 h-5" />, category: 'Document' },
  { id: 'e2pdf', name: 'Excel to PDF', icon: <FileSpreadsheet className="w-5 h-5" />, category: 'Document' },
  { id: 'html2pdf', name: 'HTML to PDF', icon: <Code className="w-5 h-5" />, category: 'Document' },
  { id: 'webp2jpg', name: 'WEBP to JPG', icon: <FileImage className="w-5 h-5" />, category: 'Image' },
  { id: 'gif2mp4', name: 'GIF to MP4', icon: <Film className="w-5 h-5" />, category: 'Media' },
  { id: 'mov2mp4', name: 'MOV to MP4', icon: <Film className="w-5 h-5" />, category: 'Media' },
  { id: 'wav2mp3', name: 'WAV to MP3', icon: <Music className="w-5 h-5" />, category: 'Media' },
  { id: 'zip2extract', name: 'ZIP Extractor', icon: <Archive className="w-5 h-5" />, category: 'Archive' },
  { id: 'rar2zip', name: 'RAR to ZIP', icon: <Archive className="w-5 h-5" />, category: 'Archive' },
  { id: 'json2csv', name: 'JSON to CSV', icon: <Code className="w-5 h-5" />, category: 'Document' },
  { id: 'pdfcompress', name: 'PDF Compressor', icon: <Zap className="w-5 h-5" />, category: 'Document' },
  { id: 'imgcompress', name: 'Image Compressor', icon: <Zap className="w-5 h-5" />, category: 'Image' },
];

export const FEATURES = [
  { title: 'Instant Conversion', desc: 'Get results in milliseconds', icon: <Zap className="text-blue-600" /> },
  { title: '100% Secure', desc: 'Military-grade encryption', icon: <ShieldCheck className="text-blue-600" /> },
  { title: 'Cloud-Based', desc: 'No heavy software needed', icon: <Cloud className="text-blue-600" /> },
  { title: 'Auto Delete', desc: 'Files wiped after 30 mins', icon: <Trash2 className="text-blue-600" /> },
  { title: 'Mobile Friendly', desc: 'Work from any device', icon: <Smartphone className="text-blue-600" /> },
  { title: 'No Installation', desc: 'Runs entirely in browser', icon: <Cpu className="text-blue-600" /> },
];

export const FAQS: FaqItem[] = [
  { question: 'Is ConvertBharat free to use?', answer: 'Yes! Our basic conversion tools are 100% free for files up to 10MB.' },
  { question: 'Are my files safe?', answer: 'Absolutely. We use SSL encryption and automatically delete all files from our servers 30 minutes after conversion.' },
  { question: 'Do I need to create an account?', answer: 'No sign-up is required for standard conversions. Just upload and convert.' },
  { question: 'What is the file size limit?', answer: 'Free users can upload files up to 10MB. Premium users enjoy support for files up to 2GB.' },
];

export const PRICING_PLANS: PricePlan[] = [
  {
    name: 'Free Plan',
    price: '₹0',
    period: 'Forever',
    features: ['Up to 10MB files', '5 conversions per day', 'Standard support', 'Ads included'],
    cta: 'Get Started'
  },
  {
    name: 'Premium Plan',
    price: '₹99',
    period: 'per month',
    recommended: true,
    features: ['Unlimited conversions', 'Up to 2GB file support', 'Bulk processing', 'No ads', 'AI Tools access'],
    cta: 'Upgrade to Premium'
  }
];
