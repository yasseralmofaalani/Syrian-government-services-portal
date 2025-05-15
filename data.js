/**
 * Datos para la aplicación de servicios gubernamentales sirios
 * Este archivo contiene los datos estáticos usados en la aplicación de mapas
 */

// Datos para centros de registro civil
const civilCentersData = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "id": 1,
                "name": "مركز السجل المدني - دمشق",
                "services": ["إصدار بطاقة هوية", "شهادة ولادة", "شهادة وفاة", "شهادة زواج", "معاملات الأحوال المدنية"],
                "status": "open",
                "workingHours": "8:30 - 15:30",
                "phone": "011-2223344",
                "address": "دمشق - ساحة المرجة",
                "rating": 4.2,
                "waitingTime": "30-45 دقيقة",
                "type": "civil",
                "reviews": 128,
                "requiredDocuments": ["صورة عن الهوية الشخصية", "صور شخصية", "طلب خطي", "إيصال دفع الرسوم"]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [36.3031, 33.5138]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 2,
                "name": "مركز السجل المدني - حلب",
                "services": ["إصدار بطاقة هوية", "شهادة ولادة", "شهادة زواج", "معاملات الأحوال المدنية"],
                "status": "open",
                "workingHours": "8:00 - 15:00",
                "phone": "021-2665544",
                "address": "حلب - الجميلية",
                "rating": 3.8,
                "waitingTime": "45-60 دقيقة",
                "type": "civil",
                "reviews": 95,
                "requiredDocuments": ["صورة عن الهوية الشخصية", "صور شخصية", "طلب خطي", "إيصال دفع الرسوم"]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [37.1579, 36.2021]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 3,
                "name": "مركز السجل المدني - اللاذقية",
                "services": ["إصدار بطاقة هوية", "شهادة ولادة", "شهادة وفاة", "شهادة زواج", "معاملات الأحوال المدنية"],
                "status": "open",
                "workingHours": "8:30 - 16:00",
                "phone": "041-2477788",
                "address": "اللاذقية - شارع بغداد",
                "rating": 4.5,
                "waitingTime": "20-30 دقيقة",
                "type": "civil",
                "reviews": 157,
                "requiredDocuments": ["صورة عن الهوية الشخصية", "صور شخصية", "طلب خطي", "إيصال دفع الرسوم"]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [35.7927, 35.5317]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 4,
                "name": "مركز السجل المدني - حمص",
                "services": ["إصدار بطاقة هوية", "شهادة ولادة", "شهادة زواج", "معاملات الأحوال المدنية"],
                "status": "open",
                "workingHours": "8:30 - 15:30",
                "phone": "031-2455566",
                "address": "حمص - ساحة الساعة",
                "rating": 4.0,
                "waitingTime": "30-45 دقيقة",
                "type": "civil",
                "reviews": 112,
                "requiredDocuments": ["صورة عن الهوية الشخصية", "صور شخصية", "طلب خطي", "إيصال دفع الرسوم"]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [36.7234, 34.7324]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 5,
                "name": "مركز السجل المدني - حماة",
                "services": ["إصدار بطاقة هوية", "شهادة ولادة", "شهادة وفاة", "شهادة زواج"],
                "status": "open",
                "workingHours": "8:00 - 15:00",
                "phone": "033-2211222",
                "address": "حماة - شارع العلمين",
                "rating": 3.7,
                "waitingTime": "45-60 دقيقة",
                "type": "civil",
                "reviews": 87,
                "requiredDocuments": ["صورة عن الهوية الشخصية", "صور شخصية", "طلب خطي", "إيصال دفع الرسوم"]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [36.7577, 35.1376]
            }
        }
    ]
};

// Datos para hospitales
const hospitalsData = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "id": 101,
                "name": "مشفى الأسد الجامعي",
                "services": ["طوارئ", "جراحة عامة", "عيادات خارجية", "رعاية مركزة", "تصوير طبي"],
                "status": "open",
                "workingHours": "24 ساعة",
                "phone": "011-2126500",
                "address": "دمشق - المزة",
                "rating": 4.3,
                "waitingTime": "45-90 دقيقة",
                "type": "hospital",
                "reviews": 245,
                "specialties": ["قلبية", "عصبية", "عظمية", "أطفال", "نسائية وتوليد", "أمراض داخلية"]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [36.2684, 33.5047]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 102,
                "name": "مشفى المواساة",
                "services": ["طوارئ", "جراحة عامة", "عيادات خارجية", "رعاية مركزة"],
                "status": "open",
                "workingHours": "24 ساعة",
                "phone": "011-6618332",
                "address": "دمشق - ساحة الجامعة",
                "rating": 4.1,
                "waitingTime": "60-120 دقيقة",
                "type": "hospital",
                "reviews": 218,
                "specialties": ["قلبية", "عصبية", "عظمية", "جراحة تجميلية", "أمراض داخلية"]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [36.2833, 33.5125]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 103,
                "name": "مشفى ابن رشد التخصصي",
                "services": ["طوارئ", "جراحة عامة", "عيادات خارجية", "رعاية مركزة", "تصوير طبي"],
                "status": "open",
                "workingHours": "24 ساعة",
                "phone": "021-2645789",
                "address": "حلب - شارع الجامعة",
                "rating": 4.0,
                "waitingTime": "30-60 دقيقة",
                "type": "hospital",
                "reviews": 198,
                "specialties": ["قلبية", "عصبية", "عظمية", "جراحة عامة", "أمراض داخلية"]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [37.1323, 36.2032]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 104,
                "name": "مشفى تشرين العسكري",
                "services": ["طوارئ", "جراحة عامة", "عيادات خارجية", "رعاية مركزة"],
                "status": "open",
                "workingHours": "24 ساعة",
                "phone": "041-2457689",
                "address": "اللاذقية - ضاحية تشرين",
                "rating": 4.2,
                "waitingTime": "30-45 دقيقة",
                "type": "hospital",
                "reviews": 175,
                "specialties": ["قلبية", "عصبية", "عظمية", "أطفال", "جراحة عامة"]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [35.7842, 35.5412]
            }
        }
    ]
};

// Datos para estaciones de policía
const policeStationsData = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "id": 201,
                "name": "قسم شرطة الميدان",
                "services": ["تقديم بلاغات", "استخراج سجل عدلي", "متابعة قضايا", "خدمات أمنية"],
                "status": "open",
                "workingHours": "24 ساعة",
                "phone": "011-8832145",
                "address": "دمشق - الميدان",
                "rating": 3.9,
                "waitingTime": "15-30 دقيقة",
                "type": "police",
                "reviews": 132,
                "requiredDocuments": ["الهوية الشخصية", "إثبات سكن", "صور شخصية"]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [36.3005, 33.4871]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 202,
                "name": "قسم شرطة الحميدية",
                "services": ["تقديم بلاغات", "استخراج سجل عدلي", "متابعة قضايا", "خدمات أمنية"],
                "status": "open",
                "workingHours": "24 ساعة",
                "phone": "011-2213450",
                "address": "دمشق - الحميدية",
                "rating": 4.0,
                "waitingTime": "20-30 دقيقة",
                "type": "police",
                "reviews": 145,
                "requiredDocuments": ["الهوية الشخصية", "إثبات سكن", "صور شخصية"]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [36.3042, 33.5112]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 203,
                "name": "قسم شرطة الجميلية",
                "services": ["تقديم بلاغات", "استخراج سجل عدلي", "متابعة قضايا"],
                "status": "open",
                "workingHours": "24 ساعة",
                "phone": "021-2675432",
                "address": "حلب - الجميلية",
                "rating": 3.8,
                "waitingTime": "30-45 دقيقة",
                "type": "police",
                "reviews": 118,
                "requiredDocuments": ["الهوية الشخصية", "إثبات سكن", "صور شخصية"]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [37.1542, 36.2154]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 204,
                "name": "قسم شرطة اللاذقية المركزي",
                "services": ["تقديم بلاغات", "استخراج سجل عدلي", "متابعة قضايا", "خدمات أمنية"],
                "status": "open",
                "workingHours": "24 ساعة",
                "phone": "041-2468790",
                "address": "اللاذقية - شارع الثورة",
                "rating": 4.1,
                "waitingTime": "15-25 دقيقة",
                "type": "police",
                "reviews": 142,
                "requiredDocuments": ["الهوية الشخصية", "إثبات سكن", "صور شخصية"]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [35.7814, 35.5281]
            }
        }
    ]
};

// Datos de proyectos gubernamentales
const projectsData = [
    {
        id: 1,
        name: "مشروع تطوير شبكة الطرق في دمشق",
        type: "infrastructure",
        location: [33.5102, 36.2913],
        status: "on_track",
        progress: 65,
        startDate: "2024-02-10",
        endDate: "2025-08-30",
        cost: 1200000,
        budget: {
            allocated: 1500000,
            spent: 850000,
            remaining: 650000
        },
        milestones: [
            { name: "دراسة الجدوى", date: "2024-02-10", completed: true },
            { name: "التخطيط والتصميم", date: "2024-04-15", completed: true },
            { name: "البدء بالتنفيذ", date: "2024-05-30", completed: true },
            { name: "إنجاز المرحلة الأولى", date: "2024-12-20", completed: false },
            { name: "إنجاز المشروع", date: "2025-08-30", completed: false }
        ]
    },
    {
        id: 2,
        name: "مشروع تطوير البنية التحتية للمستشفيات",
        type: "healthcare",
        location: [33.5138, 36.3031],
        status: "delayed",
        progress: 40,
        startDate: "2023-11-05",
        endDate: "2025-05-15",
        cost: 2500000,
        budget: {
            allocated: 3000000,
            spent: 1200000,
            remaining: 1800000
        },
        milestones: [
            { name: "دراسة الاحتياجات", date: "2023-11-05", completed: true },
            { name: "تقديم المناقصات", date: "2024-01-20", completed: true },
            { name: "بدء العمل", date: "2024-03-10", completed: true },
            { name: "تجهيز المعدات", date: "2024-08-25", completed: false },
            { name: "التشغيل التجريبي", date: "2025-02-10", completed: false },
            { name: "الافتتاح الرسمي", date: "2025-05-15", completed: false }
        ]
    },
    {
        id: 3,
        name: "مشروع تحديث منصة الخدمات الإلكترونية",
        type: "digital",
        location: [33.4871, 36.3005],
        status: "on_track",
        progress: 80,
        startDate: "2024-01-15",
        endDate: "2025-01-30",
        cost: 750000,
        budget: {
            allocated: 800000,
            spent: 600000,
            remaining: 200000
        },
        milestones: [
            { name: "تحليل المتطلبات", date: "2024-01-15", completed: true },
            { name: "تصميم النظام", date: "2024-03-20", completed: true },
            { name: "تطوير المنصة", date: "2024-07-10", completed: true },
            { name: "اختبار النظام", date: "2024-10-25", completed: false },
            { name: "إطلاق المنصة", date: "2025-01-30", completed: false }
        ]
    }
];

// Exportación de los datos para su uso en los archivos JavaScript
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        civilCentersData,
        hospitalsData,
        policeStationsData,
        projectsData
    };
}