/**
 * Script principal para la aplicación de mapa de servicios gubernamentales sirios
 * Este archivo contiene la inicialización del mapa y la lógica principal de interacción
 */

// Variables globales
let map;
let syriaLayer;
let civilCentersLayer;
let hospitalsLayer;
let policeStationsLayer;
let medicalCentersLayer;
let educationLayer;
let postOfficesLayer;
let governmentOfficesLayer;
let municipalServicesLayer;
let mapTools;
let activeAnalytics = null;
let currentChart = null;

// متغيرات المستخدم وحالة تسجيل الدخول
let currentUser = null;
let isUserLoggedIn = false;
let userDocuments = []; // الوثائق المرتبطة بالمستخدم
let userTransactions = []; // معاملات المستخدم السابقة والحالية

// إضافة طبقات التحليل المكاني
let analyticsLayers = {
    serviceGaps: L.featureGroup(),
    serviceOverlap: L.featureGroup(),
    temporalAnalysis: L.featureGroup(),
    performanceMetrics: L.featureGroup(),
    projects: L.featureGroup()
};

// تعريف بيانات التحليلات المكانية
const geoAnalytics = {
    serviceGaps: [
        {
            area: "حي الميدان",
            location: [33.5123, 36.2987],
            population: 50000,
            nearestService: "مركز الميدان للخدمات",
            distance: 2.5,
            recommendations: [
                "إنشاء مركز خدمات جديد في المنطقة",
                "تحسين وسائل النقل العام",
                "زيادة عدد الموظفين في المركز القريب"
            ]
        },
        {
            area: "حي القابون",
            location: [33.5234, 36.3123],
            population: 35000,
            nearestService: "مركز القابون للخدمات",
            distance: 3.2,
            recommendations: [
                "توسيع ساعات العمل في المركز القريب",
                "إضافة خدمات متنقلة",
                "تحسين البنية التحتية للطرق"
            ]
        },
        {
            area: "حي برزة",
            location: [33.5412, 36.3254],
            population: 65000,
            nearestService: "مركز الخدمات المتكامل - القابون",
            distance: 4.7,
            recommendations: [
                "إنشاء مركز خدمات متكامل في المنطقة",
                "تخصيص خدمات متنقلة أسبوعية",
                "تأمين خط نقل مباشر للمراكز القريبة"
            ]
        },
        {
            area: "منطقة قدسيا",
            location: [33.5623, 36.2567],
            population: 85000,
            nearestService: "مجمع الخدمات الشامل - دمر",
            distance: 5.3,
            recommendations: [
                "إنشاء مركز خدمات رئيسي",
                "تخصيص مراكز متنقلة دائمة",
                "تحسين البنية التحتية للطرق المؤدية للمراكز القريبة"
            ]
        }
    ],
    serviceOverlap: [
        {
            area: "حي المزة",
            location: [33.4987, 36.2876],
            population: 45000,
            services: [
                { type: "مراكز مدنية", count: 3 },
                { type: "مستشفيات", count: 2 },
                { type: "مراكز شرطة", count: 2 }
            ],
            recommendations: [
                "تنسيق ساعات العمل بين المراكز",
                "توزيع الخدمات بشكل أفضل",
                "تحسين التكامل بين المراكز"
            ]
        },
        {
            area: "حي كفرسوسة",
            location: [33.5123, 36.2765],
            population: 55000,
            services: [
                { type: "مراكز مدنية", count: 2 },
                { type: "مستشفيات", count: 3 },
                { type: "مراكز شرطة", count: 1 }
            ],
            recommendations: [
                "إعادة توزيع الخدمات الصحية",
                "زيادة عدد مراكز الشرطة",
                "تحسين التنسيق بين المراكز"
            ]
        },
        {
            area: "منطقة المرجة",
            location: [33.5178, 36.2945],
            population: 40000,
            services: [
                { type: "مراكز مدنية", count: 2 },
                { type: "دوائر حكومية", count: 4 },
                { type: "مكاتب بريد", count: 2 },
                { type: "خدمات بلدية وعقارية", count: 3 }
            ],
            recommendations: [
                "إنشاء مركز خدمات موحد",
                "تبسيط إجراءات التنقل بين الدوائر",
                "تحسين مرافق الانتظار والاستراحة"
            ]
        },
        {
            area: "منطقة البرامكة",
            location: [33.5156, 36.2845],
            population: 35000,
            services: [
                { type: "مراكز مدنية", count: 1 },
                { type: "مدارس وجامعات", count: 5 },
                { type: "مراكز صحية", count: 3 }
            ],
            recommendations: [
                "تخصيص خدمات موجهة للطلاب",
                "تنسيق ساعات العمل مع الجدول الدراسي",
                "تحسين وسائل النقل بين المراكز"
            ]
        }
    ],
    temporalAnalysis: {
        peakHours: {
            "8:00": 120,
            "9:00": 180,
            "10:00": 250,
            "11:00": 300,
            "12:00": 280,
            "13:00": 200,
            "14:00": 150,
            "15:00": 100
        },
        weekdayDistribution: {
            "الأحد": 350,
            "الاثنين": 420,
            "الثلاثاء": 380,
            "الأربعاء": 410,
            "الخميس": 450,
            "الجمعة": 160,
            "السبت": 200
        },
        seasonalPatterns: {
            "الشتاء": {
                "مراكز مدنية": "متوسط",
                "مستشفيات": "مرتفع",
                "خدمات بلدية": "منخفض"
            },
            "الربيع": {
                "مراكز مدنية": "مرتفع",
                "مستشفيات": "متوسط",
                "خدمات بلدية": "متوسط"
            },
            "الصيف": {
                "مراكز مدنية": "مرتفع جداً",
                "مستشفيات": "متوسط",
                "خدمات بلدية": "مرتفع"
            },
            "الخريف": {
                "مراكز مدنية": "متوسط",
                "مستشفيات": "متوسط",
                "خدمات بلدية": "مرتفع"
            }
        },
        recommendations: [
            "زيادة عدد الموظفين في ساعات الذروة",
            "توزيع المواعيد على مدار اليوم",
            "تحسين نظام الحجز المسبق",
            "افتتاح مراكز إضافية يوم الخميس",
            "تمديد ساعات العمل في مواسم الازدحام",
            "تقديم حوافز للمراجعة في أوقات الركود"
        ]
    },
    performanceMetrics: {
        byService: {
            "مراكز مدنية": {
                satisfaction: "85%",
                waitingTime: "45 دقيقة",
                availability: 95,
                processingTime: {
                    average: "30 دقيقة",
                    peak: "60 دقيقة"
                },
                digitalServices: 75,
                staffEfficiency: "80%",
                costEfficiency: "متوسط",
                accessibility: "85%"
            },
            "مستشفيات": {
                satisfaction: "90%",
                waitingTime: "30 دقيقة",
                availability: 98,
                processingTime: {
                    average: "45 دقيقة",
                    peak: "90 دقيقة"
                },
                digitalServices: 65,
                staffEfficiency: "92%",
                costEfficiency: "مرتفع",
                accessibility: "95%"
            },
            "مراكز شرطة": {
                satisfaction: "80%",
                waitingTime: "20 دقيقة",
                availability: 92,
                processingTime: {
                    average: "25 دقيقة",
                    peak: "45 دقيقة"
                },
                digitalServices: 60,
                staffEfficiency: "85%",
                costEfficiency: "متوسط",
                accessibility: "90%"
            },
            "مراكز صحية": {
                satisfaction: "88%",
                waitingTime: "15 دقيقة",
                availability: 90,
                processingTime: {
                    average: "20 دقيقة",
                    peak: "40 دقيقة"
                },
                digitalServices: 70,
                staffEfficiency: "88%",
                costEfficiency: "مرتفع",
                accessibility: "93%"
            },
            "مدارس وجامعات": {
                satisfaction: "87%",
                waitingTime: "35 دقيقة",
                availability: 80,
                processingTime: {
                    average: "40 دقيقة",
                    peak: "75 دقيقة"
                },
                digitalServices: 85,
                staffEfficiency: "75%",
                costEfficiency: "منخفض",
                accessibility: "80%"
            },
            "مكاتب بريد": {
                satisfaction: "75%",
                waitingTime: "30 دقيقة",
                availability: 90,
                processingTime: {
                    average: "15 دقيقة",
                    peak: "35 دقيقة"
                },
                digitalServices: 80,
                staffEfficiency: "82%",
                costEfficiency: "مرتفع",
                accessibility: "92%"
            },
            "دوائر حكومية": {
                satisfaction: "65%",
                waitingTime: "90 دقيقة",
                availability: 85,
                processingTime: {
                    average: "60 دقيقة",
                    peak: "120 دقيقة"
                },
                digitalServices: 55,
                staffEfficiency: "70%",
                costEfficiency: "منخفض",
                accessibility: "75%"
            },
            "خدمات بلدية وعقارية": {
                satisfaction: "70%",
                waitingTime: "75 دقيقة",
                availability: 80,
                processingTime: {
                    average: "50 دقيقة",
                    peak: "110 دقيقة"
                },
                digitalServices: 60,
                staffEfficiency: "75%",
                costEfficiency: "متوسط",
                accessibility: "78%"
            }
        },
        trends: {
            satisfaction: [65, 68, 72, 75, 80, 83],
            waitingTime: [85, 75, 60, 55, 45, 40],
            digitalAdoption: [20, 35, 45, 55, 65, 75],
            years: ["2019", "2020", "2021", "2022", "2023", "2024"]
        }
    },
    projects: {
        ongoing: [
            {
                name: "تطوير مركز الميدان",
                location: [33.5123, 36.2987],
                type: "تطوير",
                status: "قيد التنفيذ",
                progress: 65,
                startDate: "2024-01-01",
                endDate: "2024-06-30",
                budget: "5000000",
                description: "توسعة وتحديث مركز الميدان للخدمات",
                impact: {
                    services: ["زيادة عدد النوافذ", "تحسين نظام الانتظار", "إضافة خدمات جديدة"],
                    beneficiaries: 50000,
                    efficiency: "تحسين بنسبة 40%"
                }
            },
            {
                name: "مستشفى المزة الجديد",
                location: [33.4987, 36.2876],
                type: "بناء",
                status: "قيد التنفيذ",
                progress: 45,
                startDate: "2024-02-01",
                endDate: "2024-12-31",
                budget: "15000000",
                description: "بناء مستشفى جديد في منطقة المزة",
                impact: {
                    services: ["طوارئ متطورة", "عيادات متخصصة", "مركز أبحاث"],
                    beneficiaries: 100000,
                    efficiency: "تخفيض وقت الانتظار بنسبة 60%"
                }
            },
            {
                name: "البوابة الذكية للخدمات الحكومية",
                location: [33.5172, 36.2952],
                type: "تقني",
                status: "قيد التنفيذ",
                progress: 80,
                startDate: "2023-11-15",
                endDate: "2024-08-30",
                budget: "12000000",
                description: "تطوير نظام إلكتروني متكامل للخدمات الحكومية",
                impact: {
                    services: ["تقديم الخدمات عن بعد", "أتمتة الإجراءات", "تكامل بين الدوائر الحكومية"],
                    beneficiaries: 500000,
                    efficiency: "تخفيض وقت الإجراءات بنسبة 70%"
                }
            },
            {
                name: "توسعة شبكة المياه - القابون",
                location: [33.5234, 36.3123],
                type: "بنية تحتية",
                status: "قيد التنفيذ",
                progress: 35,
                startDate: "2024-03-01",
                endDate: "2024-09-30",
                budget: "7500000",
                description: "تحديث وتوسعة شبكة المياه في منطقة القابون",
                impact: {
                    services: ["تحسين جودة المياه", "زيادة التغطية", "تقليل الفاقد"],
                    beneficiaries: 45000,
                    efficiency: "تخفيض الانقطاعات بنسبة 80%"
                }
            }
        ],
        planned: [
            {
                name: "مركز خدمات كفرسوسة",
                location: [33.5123, 36.2765],
                type: "بناء",
                status: "مخطط",
                startDate: "2024-07-01",
                endDate: "2025-01-31",
                budget: "8000000",
                description: "إنشاء مركز خدمات متكامل في كفرسوسة",
                impact: {
                    services: ["خدمات مدنية", "خدمات صحية", "خدمات شرطية"],
                    beneficiaries: 75000,
                    efficiency: "تغطية احتياجات المنطقة بالكامل"
                }
            },
            {
                name: "مشروع النقل الذكي",
                location: [33.5150, 36.2950],
                type: "نقل",
                status: "مخطط",
                startDate: "2024-09-01",
                endDate: "2025-08-31",
                budget: "25000000",
                description: "تطوير شبكة نقل عام ذكية في العاصمة",
                impact: {
                    services: ["باصات حديثة", "نظام تتبع إلكتروني", "مواقف ذكية"],
                    beneficiaries: 1500000,
                    efficiency: "تخفيض وقت التنقل بنسبة 40%"
                }
            },
            {
                name: "مركز برزة الطبي",
                location: [33.5412, 36.3254],
                type: "بناء",
                status: "مخطط",
                startDate: "2024-08-15",
                endDate: "2025-06-30",
                budget: "10000000",
                description: "إنشاء مركز طبي متخصص في منطقة برزة",
                impact: {
                    services: ["رعاية أولية", "طوارئ", "عيادات متخصصة", "مختبرات"],
                    beneficiaries: 65000,
                    efficiency: "تخفيض الضغط على المستشفيات المركزية بنسبة 35%"
                }
            }
        ],
        completed: [
            {
                name: "تحديث مركز القابون",
                location: [33.5234, 36.3123],
                type: "تطوير",
                status: "مكتمل",
                completionDate: "2023-12-31",
                budget: "3000000",
                description: "تحديث وتطوير مركز القابون للخدمات",
                impact: {
                    services: ["نظام حجز إلكتروني", "تحسين البنية التحتية", "توسعة المساحات"],
                    beneficiaries: 35000,
                    efficiency: "تحسين بنسبة 50%"
                }
            },
            {
                name: "تأهيل شبكة الصرف الصحي - المزة",
                location: [33.4997, 36.2856],
                type: "بنية تحتية",
                status: "مكتمل",
                completionDate: "2023-10-15",
                budget: "6500000",
                description: "إعادة تأهيل شبكة الصرف الصحي في المزة",
                impact: {
                    services: ["تحسين البنية التحتية", "تقليل الفيضانات", "منع التلوث"],
                    beneficiaries: 85000,
                    efficiency: "تخفيض مشاكل الصرف بنسبة 90%"
                }
            },
            {
                name: "مركز المرجة للخدمات الإلكترونية",
                location: [33.5178, 36.2945],
                type: "تقني",
                status: "مكتمل",
                completionDate: "2023-11-01",
                budget: "4200000",
                description: "إنشاء مركز متخصص للخدمات الإلكترونية الحكومية",
                impact: {
                    services: ["إصدار وثائق", "تصديق معاملات", "دعم فني للخدمات الإلكترونية"],
                    beneficiaries: 200000,
                    efficiency: "تخفيض وقت المعاملات بنسبة 65%"
                }
            }
        ]
    }
};

// تعريف جدول الرسوم في أعلى الملف ليكون متاحًا للجميع
const serviceFees = {
    "مراكز مدنية": {
        "تجديد الهوية": 5000,
        "إصدار بطاقة هوية": 5000,
        "جواز السفر": 15000,
        "شهادات الميلاد": 2000,
        "شهادة ولادة": 2000
    },
    "مستشفيات": {
        "طوارئ": 10000,
        "عيادات خارجية": 5000,
        "مختبرات": 3000
    },
    "مراكز شرطة": {
        "شهادات السوابق": 2000,
        "تقرير الحوادث": 1000,
        "تجديد رخص السير": 5000
    },
    "مراكز صحية": {
        "رعاية أولية": 2000,
        "طب الأسرة": 3000,
        "لقاحات": 1000
    },
    "مدارس وجامعات": {
        "تسجيل طلاب": 1000,
        "طلب وثائق": 500,
        "تصديق شهادات": 2000
    },
    "مكاتب بريد": {
        "إرسال بريد": 500,
        "طرود بريدية": 1000,
        "حوالات مالية": 1500
    },
    "دوائر حكومية": {
        "وثائق رسمية": 2000,
        "تصاريح": 3000,
        "استعلامات": 1000
    },
    "خدمات بلدية وعقارية": {
        "تراخيص البناء": 5000,
        "مخططات عقارية": 3000,
        "فرز وتقسيم أراضي": 4000
    }
};

// تعريف بيانات الخدمات في أعلى الملف
const serviceData = {
    "مراكز مدنية": [
        {
            id: 1001,
            name: "مركز الميدان للخدمات",
            location: [33.5123, 36.2987],
            type: "مراكز مدنية",
            services: ["تجديد الهوية", "جواز السفر", "شهادات الميلاد", "شهادة ولادة", "إصدار بطاقة هوية"],
            status: "مفتوح",
            workingHours: "8:00 - 15:00",
            phone: "011-1234567",
            address: "شارع الميدان الرئيسي",
            rating: 4.5,
            waitingTime: "30 دقيقة"
        },
        {
            id: 1002,
            name: "مركز القابون للخدمات",
            location: [33.5234, 36.3123],
            type: "مراكز مدنية",
            services: ["تجديد الهوية", "جواز السفر", "شهادات الميلاد", "شهادة ولادة", "إصدار بطاقة هوية"],
            status: "مفتوح",
            workingHours: "8:00 - 15:00",
            phone: "011-2345678",
            address: "شارع القابون الرئيسي",
            rating: 4.2,
            waitingTime: "45 دقيقة"
        },
        {
            id: 1003,
            name: "مركز المزة للخدمات المدنية",
            location: [33.4987, 36.2876],
            type: "مراكز مدنية",
            services: ["تجديد الهوية", "جواز السفر", "شهادات الميلاد", "شهادة ولادة", "إصدار بطاقة هوية"],
            status: "مفتوح",
            workingHours: "8:00 - 16:00",
            phone: "011-3456789",
            address: "شارع المزة الرئيسي، بناء رقم 25",
            rating: 4.7,
            waitingTime: "20 دقيقة"
        }
    ],
    "مستشفيات": [
        {
            id: 2001,
            name: "مستشفى الأسد الجامعي",
            location: [33.5156, 36.2898],
            type: "مستشفيات",
            services: ["طوارئ", "عمليات جراحية", "عيادات خارجية", "أشعة", "مختبرات"],
            status: "مفتوح 24 ساعة",
            workingHours: "على مدار الساعة",
            phone: "011-9876543",
            address: "شارع الفيحاء، دمشق",
            rating: 4.8,
            waitingTime: "15-60 دقيقة (حسب الحالة)"
        },
        {
            id: 2002,
            name: "مستشفى المواساة",
            location: [33.5234, 36.3012],
            type: "مستشفيات",
            services: ["طوارئ", "عمليات جراحية", "عيادات خارجية", "أشعة", "مختبرات"],
            status: "مفتوح 24 ساعة",
            workingHours: "على مدار الساعة",
            phone: "011-8765432",
            address: "ساحة العباسيين، دمشق",
            rating: 4.6,
            waitingTime: "20-90 دقيقة (حسب الحالة)"
        },
        {
            id: 2003,
            name: "المستشفى الإيطالي",
            location: [33.5012, 36.2754],
            type: "مستشفيات",
            services: ["طوارئ", "عمليات جراحية", "عيادات خارجية", "أشعة", "مختبرات"],
            status: "مفتوح 24 ساعة",
            workingHours: "على مدار الساعة",
            phone: "011-7654321",
            address: "كفرسوسة، دمشق",
            rating: 4.9,
            waitingTime: "10-45 دقيقة (حسب الحالة)"
        }
    ],
    "مراكز شرطة": [
        {
            id: 3001,
            name: "قسم شرطة الميدان",
            location: [33.5125, 36.2978],
            type: "مراكز شرطة",
            services: ["شهادات السوابق", "تقرير الحوادث", "الشكاوى", "تجديد رخص السير"],
            status: "مفتوح 24 ساعة",
            workingHours: "على مدار الساعة",
            phone: "011-5555555",
            address: "شارع الميدان الفرعي",
            rating: 4.0,
            waitingTime: "20-40 دقيقة"
        },
        {
            id: 3002,
            name: "قسم شرطة القابون",
            location: [33.5245, 36.3133],
            type: "مراكز شرطة",
            services: ["شهادات السوابق", "تقرير الحوادث", "الشكاوى", "تجديد رخص السير"],
            status: "مفتوح 24 ساعة",
            workingHours: "على مدار الساعة",
            phone: "011-6666666",
            address: "شارع القابون، بناء الأمن العام",
            rating: 3.8,
            waitingTime: "30-50 دقيقة"
        },
        {
            id: 3003,
            name: "قسم شرطة المزة",
            location: [33.4978, 36.2866],
            type: "مراكز شرطة",
            services: ["شهادات السوابق", "تقرير الحوادث", "الشكاوى", "تجديد رخص السير"],
            status: "مفتوح 24 ساعة",
            workingHours: "على مدار الساعة",
            phone: "011-7777777",
            address: "أتوستراد المزة، مفرق الطيران",
            rating: 4.3,
            waitingTime: "15-30 دقيقة"
        }
    ],
    "مراكز صحية": [
        {
            id: 4001,
            name: "المركز الصحي الشامل - الميدان",
            location: [33.5134, 36.2997],
            type: "مراكز صحية",
            services: ["رعاية أولية", "لقاحات", "متابعة حوامل", "صحة أطفال", "صيدلية"],
            status: "مفتوح",
            workingHours: "8:00 - 17:00",
            phone: "011-4444444",
            address: "شارع الميدان، قرب البريد المركزي",
            rating: 4.4,
            waitingTime: "15-25 دقيقة"
        },
        {
            id: 4002,
            name: "مركز الرعاية الصحية - المزة",
            location: [33.4995, 36.2886],
            type: "مراكز صحية",
            services: ["رعاية أولية", "لقاحات", "متابعة حوامل", "صحة أطفال", "صيدلية"],
            status: "مفتوح",
            workingHours: "8:00 - 17:00",
            phone: "011-3333333",
            address: "المزة، شيخ سعد، بناء النور",
            rating: 4.6,
            waitingTime: "10-20 دقيقة"
        },
        {
            id: 4003,
            name: "صيدلية الخدمة الدائمة - كفرسوسة",
            location: [33.5113, 36.2765],
            type: "مراكز صحية",
            services: ["صيدلية 24 ساعة", "استشارات دوائية", "قياس ضغط وسكر"],
            status: "مفتوح 24 ساعة",
            workingHours: "على مدار الساعة",
            phone: "011-2222222",
            address: "كفرسوسة، شارع الجامعة",
            rating: 4.7,
            waitingTime: "5-10 دقيقة"
        }
    ],
    "مدارس وجامعات": [
        {
            id: 5001,
            name: "جامعة دمشق - كلية الهندسة",
            location: [33.5156, 36.2845],
            type: "مدارس وجامعات",
            services: ["تسجيل طلاب", "خدمات تعليمية", "شؤون طلابية", "منح دراسية"],
            status: "مفتوح خلال العام الدراسي",
            workingHours: "8:00 - 16:00",
            phone: "011-0000001",
            address: "البرامكة، مجمع الكليات",
            rating: 4.7,
            waitingTime: "حسب الخدمة المطلوبة"
        },
        {
            id: 5002,
            name: "مدرسة الشويفات الدولية",
            location: [33.4945, 36.2912],
            type: "مدارس وجامعات",
            services: ["تعليم ابتدائي", "تعليم إعدادي", "تعليم ثانوي", "أنشطة رياضية"],
            status: "مفتوح خلال العام الدراسي",
            workingHours: "7:30 - 15:30",
            phone: "011-0000002",
            address: "المزة، 86 بناء الشويفات",
            rating: 4.8,
            waitingTime: "بالموعد فقط"
        },
        {
            id: 5003,
            name: "المعهد العالي للغات",
            location: [33.5187, 36.2935],
            type: "مدارس وجامعات",
            services: ["دورات لغة انجليزية", "دورات لغة فرنسية", "دورات لغة ألمانية", "شهادات دولية"],
            status: "مفتوح",
            workingHours: "9:00 - 20:00",
            phone: "011-0000003",
            address: "شارع الثورة، مقابل حديقة التجارة",
            rating: 4.5,
            waitingTime: "بالموعد فقط"
        }
    ],
    "مكاتب بريد": [
        {
            id: 6001,
            name: "مكتب البريد المركزي - دمشق",
            location: [33.5178, 36.2945],
            type: "مكاتب بريد",
            services: ["إرسال بريد", "استلام طرود", "حوالات مالية", "فواتير", "خدمات حكومية"],
            status: "مفتوح",
            workingHours: "8:00 - 16:00",
            phone: "011-1111111",
            address: "ساحة المرجة، بناء البريد المركزي",
            rating: 4.2,
            waitingTime: "15-40 دقيقة"
        },
        {
            id: 6002,
            name: "مكتب بريد المزة",
            location: [33.4967, 36.2856],
            type: "مكاتب بريد",
            services: ["إرسال بريد", "استلام طرود", "حوالات مالية", "فواتير"],
            status: "مفتوح",
            workingHours: "8:00 - 15:00",
            phone: "011-1111112",
            address: "المزة، جانب فندق الشام",
            rating: 4.0,
            waitingTime: "10-30 دقيقة"
        },
        {
            id: 6003,
            name: "مكتب بريد الحلبوني",
            location: [33.5123, 36.2987],
            type: "مكاتب بريد",
            services: ["إرسال بريد", "استلام طرود", "حوالات مالية", "فواتير"],
            status: "مفتوح",
            workingHours: "8:00 - 15:00",
            phone: "011-1111113",
            address: "الحلبوني، قرب مشفى المجتهد",
            rating: 3.9,
            waitingTime: "20-40 دقيقة"
        }
    ],
    "دوائر حكومية": [
        {
            id: 7001,
            name: "وزارة الداخلية - إدارة الهجرة والجوازات",
            location: [33.5189, 36.2967],
            type: "دوائر حكومية",
            services: ["إصدار جوازات سفر", "تأشيرات", "إقامات", "معاملات خروج ودخول"],
            status: "مفتوح",
            workingHours: "8:00 - 15:00",
            phone: "011-9999991",
            address: "مرجة، خلف البريد المركزي",
            rating: 3.7,
            waitingTime: "30-120 دقيقة"
        },
        {
            id: 7002,
            name: "مديرية المالية",
            location: [33.5145, 36.2976],
            type: "دوائر حكومية",
            services: ["ضرائب دخل", "رسوم عقارية", "تسجيل شركات", "تراخيص"],
            status: "مفتوح",
            workingHours: "8:00 - 15:00",
            phone: "011-9999992",
            address: "كورنيش التجارة، بناء وزارة المالية",
            rating: 3.5,
            waitingTime: "45-90 دقيقة"
        },
        {
            id: 7003,
            name: "وزارة النقل",
            location: [33.5167, 36.2934],
            type: "دوائر حكومية",
            services: ["ترخيص مركبات", "فحص فني", "شهادات قيادة", "تسجيل مركبات"],
            status: "مفتوح",
            workingHours: "8:00 - 15:00",
            phone: "011-9999993",
            address: "المرجة، بناء النقل المركزي",
            rating: 3.6,
            waitingTime: "60-120 دقيقة"
        }
    ],
    "خدمات بلدية وعقارية": [
        {
            id: 8001,
            name: "مديرية السجل العقاري المركزي",
            location: [33.5156, 36.2987],
            type: "خدمات بلدية وعقارية",
            services: ["معاملات بيع وشراء", "إفراز عقاري", "رهن عقاري", "استعلام عقاري"],
            status: "مفتوح",
            workingHours: "8:00 - 14:00",
            phone: "011-8888881",
            address: "المرجة، بناء العدل",
            rating: 3.4,
            waitingTime: "60-180 دقيقة"
        },
        {
            id: 8002,
            name: "بلدية دمشق - قسم التراخيص",
            location: [33.5134, 36.2945],
            type: "خدمات بلدية وعقارية",
            services: ["تراخيص بناء", "مخططات هندسية", "تقسيم أراضي", "شكاوى خدمية"],
            status: "مفتوح",
            workingHours: "8:00 - 15:00",
            phone: "011-8888882",
            address: "ساحة المحافظة، بناء البلدية",
            rating: 3.3,
            waitingTime: "45-120 دقيقة"
        },
        {
            id: 8003,
            name: "مؤسسة المياه - مركز خدمة المواطن",
            location: [33.5123, 36.2965],
            type: "خدمات بلدية وعقارية",
            services: ["فواتير مياه", "طلبات اشتراك", "صيانة شبكات", "شكاوى"],
            status: "مفتوح",
            workingHours: "8:00 - 15:00",
            phone: "011-8888883",
            address: "كورنيش التجارة، بناء المؤسسة",
            rating: 3.8,
            waitingTime: "20-60 دقيقة"
        }
    ]
};

// دالة للبحث عن رسوم خدمة حسب الاسم في جميع التصنيفات
function getFeeForService(serviceName) {
    for (const category in serviceFees) {
        if (serviceFees[category][serviceName] !== undefined) {
            return serviceFees[category][serviceName];
        }
    }
    return 0; // إذا لم توجد رسوم، يرجع 0
}

// دالة تسجيل الدخول باستخدام الرقم الوطني
function loginWithNationalID(nationalID, password) {
    // محاكاة التحقق من قاعدة البيانات
    if (nationalID && password) {
        // في التطبيق الحقيقي، سيتم التحقق من قاعدة البيانات
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // استخدام بيانات المستخدم التجريبي التي تم تعريفها مسبقاً
                // للتجربة، قبول أي رقم وطني وكلمة مرور (للعرض التوضيحي فقط)
                
                // تعيين بيانات المستخدم
                currentUser = demoUser;
                userDocuments = demoUser.documents;
                userTransactions = demoUser.transactions;
                isUserLoggedIn = true;
                resolve(demoUser);
                
                // في الواقع، سيكون هناك تحقق حقيقي
                // if (nationalID === "1234567890" && password === "password") {
                //     resolve(demoUser);
                // } else {
                //     reject(new Error("بيانات الدخول غير صحيحة"));
                // }
            }, 1000);
        });
    } else {
        return Promise.reject(new Error("يرجى إدخال الرقم الوطني وكلمة المرور"));
    }
}

// دالة لتحديث واجهة المستخدم بعد تسجيل الدخول
function updateUIAfterLogin(user) {
    // تحديث عناصر واجهة المستخدم
    const userInfoElement = document.getElementById('userInfo');
    if (userInfoElement) {
        userInfoElement.innerHTML = `
            <div class="user-profile">
                <i class="fas fa-user-circle"></i>
                <span class="user-name">${user.name}</span>
            </div>
        `;
    }
    
    // إظهار قائمة الخدمات الشخصية
    const personalServicesElement = document.getElementById('personalServices');
    if (personalServicesElement) {
        personalServicesElement.classList.remove('hidden');
    }
    
    // إظهار زر تسجيل الخروج وإخفاء زر تسجيل الدخول
    const loginButton = document.getElementById('btnLogin');
    const logoutButton = document.getElementById('btnLogout');
    
    if (loginButton) loginButton.classList.add('hidden');
    if (logoutButton) logoutButton.classList.remove('hidden');
}

// دالة لتحديث واجهة المستخدم بعد تسجيل الخروج
function updateUIAfterLogout() {
    // إعادة تعيين معلومات المستخدم
    const userInfoElement = document.getElementById('userInfo');
    if (userInfoElement) {
        userInfoElement.innerHTML = `
            <div class="user-profile">
                <i class="fas fa-user-circle"></i>
                <span class="user-name">زائر</span>
            </div>
        `;
    }
    
    // إخفاء قائمة الخدمات الشخصية
    const personalServicesElement = document.getElementById('personalServices');
    if (personalServicesElement) {
        personalServicesElement.classList.add('hidden');
    }
    
    // إظهار زر تسجيل الدخول وإخفاء زر تسجيل الخروج
    const loginButton = document.getElementById('btnLogin');
    const logoutButton = document.getElementById('btnLogout');
    
    if (loginButton) loginButton.classList.remove('hidden');
    if (logoutButton) logoutButton.classList.add('hidden');
}

// دالة للتحقق من صلاحية الوثائق
function validateUserDocument(documentId) {
    if (!isUserLoggedIn || !currentUser) {
        return Promise.reject(new Error("يرجى تسجيل الدخول أولاً"));
    }
    
    // البحث عن الوثيقة
    const document = userDocuments.find(doc => doc.id === documentId);
    
    if (document) {
        const expiryDate = new Date(document.expiryDate);
        const currentDate = new Date();
        
        if (expiryDate > currentDate) {
            return Promise.resolve({
                valid: true,
                document: document,
                message: "الوثيقة سارية المفعول"
            });
        } else {
            return Promise.resolve({
                valid: false,
                document: document,
                message: "الوثيقة منتهية الصلاحية"
            });
        }
    } else {
        return Promise.reject(new Error("الوثيقة غير موجودة"));
    }
}

// Inicialización cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el mapa
    initializeMap();
    
    // Inicializar los controladores de eventos
    initializeEventListeners();
    
    // Cargar datos
    loadMapData();
    
    // إظهار نافذة ترحيبية للمستخدم بعد تحميل الصفحة
    setTimeout(() => {
        showInfoMessage(
            'مرحباً بك في بوابة الخدمات الحكومية السورية',
            'يمكنك استكشاف الخدمات المتاحة عبر الخريطة التفاعلية، أو الاطلاع على وثائقك ومعاملاتك الشخصية بعد تسجيل الدخول.',
            'للتجربة التوضيحية، يمكنك تسجيل الدخول باستخدام أي رقم وطني وكلمة مرور.'
        );
    }, 1500);
    
    // إضافة مستمع أحداث لأزرار التنقل السريع
    document.getElementById('btnMyDocuments').addEventListener('click', function() {
        // للعرض التوضيحي، نقوم بتعيين المستخدم الافتراضي بشكل مباشر
        if (!isUserLoggedIn) {
            currentUser = demoUser;
            userDocuments = demoUser.documents;
            userTransactions = demoUser.transactions;
            isUserLoggedIn = true;
            updateUIAfterLogin(demoUser);
        }
        showUserDocuments();
    });
    
    document.getElementById('btnMyTransactions').addEventListener('click', function() {
        // للعرض التوضيحي، نقوم بتعيين المستخدم الافتراضي بشكل مباشر
        if (!isUserLoggedIn) {
            currentUser = demoUser;
            userDocuments = demoUser.documents;
            userTransactions = demoUser.transactions;
            isUserLoggedIn = true;
            updateUIAfterLogin(demoUser);
        }
        showUserTransactions();
    });
});

// Inicializar el mapa de Leaflet
function initializeMap() {
    // Crear el mapa centrado en Siria
    map = L.map('map', {
        center: [35.0, 38.5], // Centro aproximado de Siria
        zoom: 7,
        minZoom: 6,
        maxZoom: 18,
        zoomControl: false
    });
    
    // Agregar control de zoom en la posición superior derecha
    L.control.zoom({
        position: 'topright'
    }).addTo(map);
    
    // Agregar capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Inicializar herramientas del mapa
    mapTools = initializeMapTools(map);
    
    // Inicializar capas como FeatureGroups
    civilCentersLayer = L.featureGroup();
    hospitalsLayer = L.featureGroup();
    policeStationsLayer = L.featureGroup();
    medicalCentersLayer = L.featureGroup();
    educationLayer = L.featureGroup();
    postOfficesLayer = L.featureGroup();
    governmentOfficesLayer = L.featureGroup();
    municipalServicesLayer = L.featureGroup();
    syriaLayer = L.featureGroup();
    
    // Agregar capas al mapa
    map.addLayer(civilCentersLayer);
    map.addLayer(hospitalsLayer);
    map.addLayer(policeStationsLayer);
    map.addLayer(medicalCentersLayer);
    map.addLayer(educationLayer);
    map.addLayer(postOfficesLayer);
    map.addLayer(governmentOfficesLayer);
    map.addLayer(municipalServicesLayer);
    map.addLayer(syriaLayer);
    
    // تهيئة طبقات التحليل
    initializeAnalyticsLayers();
}

// Cargar datos del mapa
function loadMapData() {
    // Cargar datos de Siria (contornos)
    fetch('attached_assets/syria.geojson')
        .then(response => response.json())
        .then(data => {
            const geoJsonLayer = L.geoJSON(data, {
                style: generateStyleForFeature,
                onEachFeature: function(feature, layer) {
                    // Agregar popup con nombre de la gobernación
                    if (feature.properties && feature.properties.ADM1_AR) {
                        layer.bindPopup(`<div dir="rtl"><strong>${feature.properties.ADM1_AR}</strong></div>`);
                    }
                    
                    // Agregar efectos de hover
                    addHoverHandlers(layer, map);
                }
            });
            
            // Clear existing layers and add new ones
            syriaLayer.clearLayers();
            geoJsonLayer.eachLayer(layer => {
                syriaLayer.addLayer(layer);
            });
        })
        .catch(error => {
            console.error('Error al cargar el GeoJSON de Siria:', error);
        });
    
    // Cargar datos desde el archivo de datos
    loadServiceData();
}

// Cargar datos de servicios desde el archivo de datos
function loadServiceData() {
    // Limpiar capas existentes
    civilCentersLayer.clearLayers();
    hospitalsLayer.clearLayers();
    policeStationsLayer.clearLayers();
    medicalCentersLayer.clearLayers();
    educationLayer.clearLayers();
    postOfficesLayer.clearLayers();
    governmentOfficesLayer.clearLayers();
    
    // Agregar centros de registro civil
    if (civilCentersData && civilCentersData.features) {
        civilCentersData.features.forEach(feature => {
            const marker = createServiceMarker(feature, map, onServiceSelected);
            if (marker) {
                civilCentersLayer.addLayer(marker);
            }
        });
    }
    
    // Agregar hospitales
    if (hospitalsData && hospitalsData.features) {
        hospitalsData.features.forEach(feature => {
            const marker = createServiceMarker(feature, map, onServiceSelected);
            if (marker) {
                hospitalsLayer.addLayer(marker);
            }
        });
    }
    
    // Agregar estaciones de policía
    if (policeStationsData && policeStationsData.features) {
        policeStationsData.features.forEach(feature => {
            const marker = createServiceMarker(feature, map, onServiceSelected);
            if (marker) {
                policeStationsLayer.addLayer(marker);
            }
        });
    }
    
    // Agregar centros médicos y farmacias
    if (serviceData["مراكز صحية"]) {
        serviceData["مراكز صحية"].forEach(service => {
            const marker = createServiceMarkerFromData(service, map, onServiceSelected);
            if (marker) {
                medicalCentersLayer.addLayer(marker);
            }
        });
    }
    
    // Agregar escuelas y universidades
    if (serviceData["مدارس وجامعات"]) {
        serviceData["مدارس وجامعات"].forEach(service => {
            const marker = createServiceMarkerFromData(service, map, onServiceSelected);
            if (marker) {
                educationLayer.addLayer(marker);
            }
        });
    }
    
    // Agregar oficinas de correos
    if (serviceData["مكاتب بريد"]) {
        serviceData["مكاتب بريد"].forEach(service => {
            const marker = createServiceMarkerFromData(service, map, onServiceSelected);
            if (marker) {
                postOfficesLayer.addLayer(marker);
            }
        });
    }
    
    // Agregar oficinas gubernamentales
    if (serviceData["دوائر حكومية"]) {
        serviceData["دوائر حكومية"].forEach(service => {
            const marker = createServiceMarkerFromData(service, map, onServiceSelected);
            if (marker) {
                governmentOfficesLayer.addLayer(marker);
            }
        });
    }
    
    // Agregar servicios municipales y bienes raíces
    if (serviceData["خدمات بلدية وعقارية"]) {
        serviceData["خدمات بلدية وعقارية"].forEach(service => {
            const marker = createServiceMarkerFromData(service, map, onServiceSelected);
            if (marker) {
                municipalServicesLayer.addLayer(marker);
            }
        });
    }
}

// Create a service marker from direct data object
function createServiceMarkerFromData(serviceData, map, callback) {
    if (!serviceData || !serviceData.location) {
        return null;
    }
    
    // Determine icon based on service type
    const icon = getServiceIcon(serviceData.type);
    
    // Create marker
    const marker = L.marker(serviceData.location, {
        icon: icon,
        title: serviceData.name
    });
    
    // Create popup content
    const popupContent = createServicePopup(serviceData);
    marker.bindPopup(popupContent);
    
    // Add click handler
    marker.on('click', function() {
        if (callback) {
            callback(serviceData);
        }
    });
    
    return marker;
}

// Get icon based on service type
function getServiceIcon(serviceType) {
    let iconClass = 'fa-building';
    let iconColor = '#3388ff';
    
    switch(serviceType) {
        case 'مراكز مدنية':
            iconClass = 'fa-id-card';
            iconColor = '#1e88e5';
            break;
        case 'مستشفيات':
            iconClass = 'fa-hospital';
            iconColor = '#e53935';
            break;
        case 'مراكز شرطة':
            iconClass = 'fa-shield-alt';
            iconColor = '#43a047';
            break;
        case 'مراكز صحية':
            iconClass = 'fa-clinic-medical';
            iconColor = '#8e24aa';
            break;
        case 'مدارس وجامعات':
            iconClass = 'fa-graduation-cap';
            iconColor = '#fb8c00';
            break;
        case 'مكاتب بريد':
            iconClass = 'fa-envelope';
            iconColor = '#fdd835';
            break;
        case 'دوائر حكومية':
            iconClass = 'fa-landmark';
            iconColor = '#546e7a';
            break;
        case 'خدمات بلدية وعقارية':
            iconClass = 'fa-map-marked-alt';
            iconColor = '#009688';
            break;
    }
    
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${iconColor};" class="marker-pin">
                   <i class="fas ${iconClass}"></i>
               </div>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42]
    });
}

// Create popup content for service
function createServicePopup(service) {
    const servicesHtml = service.services 
        ? `<p class="service-list">${service.services.join('، ')}</p>` 
        : '';
    
    // Handle specialized features for municipal services
    let specializedFeaturesHtml = '';
    if (service.type === 'خدمات بلدية وعقارية' && service.mapFeatures) {
        const features = [];
        
        if (service.mapFeatures.hasResidentialMaps) {
            features.push('<li><i class="fas fa-home"></i> خرائط الأحياء السكنية</li>');
        }
        if (service.mapFeatures.hasIndustrialMaps) {
            features.push('<li><i class="fas fa-industry"></i> خرائط المناطق الصناعية</li>');
        }
        if (service.mapFeatures.hasZoningLaws) {
            features.push('<li><i class="fas fa-sitemap"></i> قوانين تقسيم المناطق</li>');
        }
        if (service.mapFeatures.hasPropertyMaps) {
            features.push('<li><i class="fas fa-map"></i> خرائط العقارات</li>');
        }
        if (service.mapFeatures.hasCadastralServices) {
            features.push('<li><i class="fas fa-draw-polygon"></i> خدمات مساحية</li>');
        }
        if (service.mapFeatures.hasLandRegistry) {
            features.push('<li><i class="fas fa-book"></i> سجل الأراضي</li>');
        }
        if (service.mapFeatures.hasBuildingPermits) {
            features.push('<li><i class="fas fa-file-contract"></i> تراخيص البناء</li>');
        }
        if (service.mapFeatures.hasZoningMaps) {
            features.push('<li><i class="fas fa-layer-group"></i> خرائط مناطق البناء المسموحة</li>');
        }
        if (service.mapFeatures.hasConstructionRegulations) {
            features.push('<li><i class="fas fa-hard-hat"></i> أنظمة البناء</li>');
        }
        if (service.mapFeatures.hasPropertyInquiry) {
            features.push('<li><i class="fas fa-search-location"></i> استعلام عقاري</li>');
        }
        if (service.mapFeatures.hasContractDocumentation) {
            features.push('<li><i class="fas fa-file-signature"></i> توثيق عقود</li>');
        }
        if (service.mapFeatures.hasLandDivision) {
            features.push('<li><i class="fas fa-puzzle-piece"></i> فرز وتقسيم أراضي</li>');
        }
        
        if (features.length > 0) {
            specializedFeaturesHtml = `
                <div class="municipal-features">
                    <h4>الخدمات المتخصصة</h4>
                    <ul class="features-list">
                        ${features.join('')}
                    </ul>
                </div>
            `;
        }
    }
    
    return `
        <div class="service-popup" dir="rtl">
            <h3>${service.name}</h3>
            <p class="service-type">${service.type}</p>
            ${servicesHtml}
            <p class="service-status ${service.status === 'مفتوح' ? 'open' : 'closed'}">
                <i class="fas ${service.status === 'مفتوح' ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                ${service.status}
            </p>
            <p class="service-hours">
                <i class="far fa-clock"></i> ${service.workingHours}
            </p>
            <p class="service-address">
                <i class="fas fa-map-marker-alt"></i> ${service.address}
            </p>
            <p class="service-phone">
                <i class="fas fa-phone"></i> ${service.phone}
            </p>
            <div class="service-rating">
                ${getStarRating(service.rating)}
                <span class="rating-text">${service.rating} / 5</span>
            </div>
            <p class="service-waiting">
                <i class="fas fa-hourglass-half"></i> وقت الانتظار: ${service.waitingTime}
            </p>
            ${specializedFeaturesHtml}
            <div class="service-actions">
                <button class="btn btn-primary" onclick="getDirections('${service.id}')">
                    <i class="fas fa-directions"></i> الحصول على الاتجاهات
                </button>
                <button class="btn btn-secondary" onclick="showRegistrationForm('${service.id}', '${service.type}')">
                    <i class="fas fa-calendar-check"></i> حجز موعد
                </button>
            </div>
        </div>
    `;
}

// Generate star rating HTML
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHtml = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    
    if (halfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }
    
    return starsHtml;
}

// Inicializar controladores de eventos
function initializeEventListeners() {
    // Controles de capas
    const civilCentersLayer = document.getElementById('civilCentersLayer');
    if (civilCentersLayer) civilCentersLayer.addEventListener('change', toggleLayer);
    
    const hospitalsLayer = document.getElementById('hospitalsLayer');
    if (hospitalsLayer) hospitalsLayer.addEventListener('change', toggleLayer);
    
    const policeLayer = document.getElementById('policeLayer');
    if (policeLayer) policeLayer.addEventListener('change', toggleLayer);
    
    const medicalCentersLayer = document.getElementById('medicalCentersLayer');
    if (medicalCentersLayer) medicalCentersLayer.addEventListener('change', toggleLayer);
    
    const educationLayer = document.getElementById('educationLayer');
    if (educationLayer) educationLayer.addEventListener('change', toggleLayer);
    
    const postOfficesLayer = document.getElementById('postOfficesLayer');
    if (postOfficesLayer) postOfficesLayer.addEventListener('change', toggleLayer);
    
    const governmentOfficesLayer = document.getElementById('governmentOfficesLayer');
    if (governmentOfficesLayer) governmentOfficesLayer.addEventListener('change', toggleLayer);
    
    const municipalServicesLayer = document.getElementById('municipalServicesLayer');
    if (municipalServicesLayer) municipalServicesLayer.addEventListener('change', toggleLayer);
    
    const boundariesLayer = document.getElementById('boundariesLayer');
    if (boundariesLayer) boundariesLayer.addEventListener('change', toggleLayer);
    
    // أحداث تسجيل الدخول
    const btnLogin = document.getElementById('btnLogin');
    if (btnLogin) {
        btnLogin.addEventListener('click', showLoginForm);
    }
    
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', handleLogout);
    }
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin(this);
        });
    }
    
    // Botones de la barra lateral
    const sidebarClose = document.getElementById('sidebarClose');
    if (sidebarClose) sidebarClose.addEventListener('click', toggleSidebar);
    
    // Botones de analítica
    const btnServiceGaps = document.getElementById('btnServiceGaps');
    if (btnServiceGaps) btnServiceGaps.addEventListener('click', () => showAnalytics('gaps'));
    
    const btnServiceOverlap = document.getElementById('btnServiceOverlap');
    if (btnServiceOverlap) btnServiceOverlap.addEventListener('click', () => showAnalytics('overlap'));
    
    const btnTemporalAnalysis = document.getElementById('btnTemporalAnalysis');
    if (btnTemporalAnalysis) btnTemporalAnalysis.addEventListener('click', () => showAnalytics('temporal'));
    
    const btnProjectAnalytics = document.getElementById('btnProjectAnalytics');
    if (btnProjectAnalytics) btnProjectAnalytics.addEventListener('click', () => showAnalytics('projects'));
    
    const btnSatisfactionPie = document.getElementById('btnSatisfactionPie');
    if (btnSatisfactionPie) btnSatisfactionPie.addEventListener('click', () => showAnalytics('satisfactionPie'));
    
    const btnVisitorsLine = document.getElementById('btnVisitorsLine');
    if (btnVisitorsLine) btnVisitorsLine.addEventListener('click', () => showAnalytics('visitorsLine'));
    
    const btnHeatmap = document.getElementById('btnHeatmap');
    if (btnHeatmap) btnHeatmap.addEventListener('click', () => showAnalytics('heatmap'));
    
    // زر لوحة معلومات الخدمات الحكومية
    const btnGovDashboard = document.getElementById('btnGovDashboard');
    if (btnGovDashboard) {
        btnGovDashboard.addEventListener('click', showGovernmentDashboard);
    }
    
    // زر عرض المستندات الشخصية
    const btnMyDocuments = document.getElementById('btnMyDocuments');
    if (btnMyDocuments) {
        btnMyDocuments.addEventListener('click', showUserDocuments);
    }
    
    // زر عرض المعاملات السابقة
    const btnMyTransactions = document.getElementById('btnMyTransactions');
    if (btnMyTransactions) {
        btnMyTransactions.addEventListener('click', showUserTransactions);
    }
    
    // Botones de herramientas
    const btnLocateUser = document.getElementById('btnLocateUser');
    if (btnLocateUser) btnLocateUser.addEventListener('click', locateUser);
    
    const btnMeasureDistance = document.getElementById('btnMeasureDistance');
    if (btnMeasureDistance) btnMeasureDistance.addEventListener('click', startDistanceMeasurement);
    
    const btnPrintMap = document.getElementById('btnPrintMap');
    if (btnPrintMap) btnPrintMap.addEventListener('click', () => printMap(map));
    
    const btnReport = document.getElementById('btnReport');
    if (btnReport) btnReport.addEventListener('click', reportIssue);
    
    // Modales
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal.id);
        });
    });
    
    // Formulario de registro
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const locationId = document.getElementById('locationId').value;
            const serviceName = document.getElementById('serviceName').value;
            handleRegistration(locationId, serviceName, this);
        });
    }

    // Payment method selection
    const paymentMethod = document.getElementById('paymentMethod');
    if (paymentMethod) {
        paymentMethod.addEventListener('change', function(e) {
            const creditCardFields = document.getElementById('creditCardFields');
            if (creditCardFields) {
                creditCardFields.style.display = this.value === 'credit' ? 'block' : 'none';
                
                // Toggle required attribute on credit card fields
                const cardFields = creditCardFields.querySelectorAll('input');
                cardFields.forEach(field => {
                    field.required = this.value === 'credit';
                });
            }
        });
    }
    
    // Formulario de reporte
    const reportIssueForm = document.getElementById('reportIssueForm');
    if (reportIssueForm) {
        reportIssueForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleIssueReport(this);
        });
    }
    
    // Botones de copia y descarga
    const copyReportBtn = document.getElementById('copyReport');
    if (copyReportBtn) {
        copyReportBtn.addEventListener('click', function() {
            copyReport(this);
        });
    }
    
    const downloadReportBtn = document.getElementById('downloadReport');
    if (downloadReportBtn) {
        downloadReportBtn.addEventListener('click', function() {
            downloadReport(this);
        });
    }
}

// Alternar visibilidad de capas
function toggleLayer(e) {
    const checkbox = e.target;
    const layerId = checkbox.id;
    const isChecked = checkbox.checked;
    
    let targetLayer;
    switch(layerId) {
        case 'civilCentersLayer':
            targetLayer = civilCentersLayer;
            break;
        case 'hospitalsLayer':
            targetLayer = hospitalsLayer;
            break;
        case 'policeLayer':
            targetLayer = policeStationsLayer;
            break;
        case 'medicalCentersLayer':
            targetLayer = medicalCentersLayer;
            break;
        case 'educationLayer':
            targetLayer = educationLayer;
            break;
        case 'postOfficesLayer':
            targetLayer = postOfficesLayer;
            break;
        case 'governmentOfficesLayer':
            targetLayer = governmentOfficesLayer;
            break;
        case 'municipalServicesLayer':
            targetLayer = municipalServicesLayer;
            break;
        case 'boundariesLayer':
            targetLayer = syriaLayer;
            break;
        default:
            console.error('Unknown layer:', layerId);
            return;
    }
    
    if (targetLayer) {
        if (isChecked) {
            if (!map.hasLayer(targetLayer)) {
                map.addLayer(targetLayer);
            }
        } else {
            if (map.hasLayer(targetLayer)) {
                map.removeLayer(targetLayer);
            }
        }
    }
}

// Alternar la visibilidad de la barra lateral
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
}

// Selección de un servicio en el mapa
function onServiceSelected(feature) {
    // Handle both feature objects and direct service objects
    const serviceName = feature.properties ? feature.properties.name : feature.name;
    console.log('Servicio seleccionado:', serviceName);
}

// Localizar al usuario
function locateUser() {
    getUserLocation()
        .then(coords => {
            map.setView(coords, 15);
            L.marker(coords).addTo(map)
                .bindPopup('<div dir="rtl">موقعك الحالي</div>')
                .openPopup();
        })
        .catch(error => {
            showModal('خطأ في تحديد الموقع', error.message);
        });
}

// Iniciar medición de distancia
function startDistanceMeasurement() {
    if (!mapTools.measureControl._map) {
        mapTools.measureControl.addTo(map);
    }
    
    // Simular un clic en el botón de la herramienta de medición
    const measureButton = document.querySelector('.leaflet-control-measure a');
    if (measureButton) {
        measureButton.click();
    }
}

// Reportar un problema
function reportIssue() {
    showModal('reportIssueModal');
}

// Manejar el envío del formulario de reporte
function handleIssueReport(form) {
    const issueType = form.elements.issueType.value;
    const description = form.elements.issueDescription.value;
    const email = form.elements.contactEmail.value;
    
    console.log('Reporte enviado:', { issueType, description, email });
    
    // Simular envío exitoso
    form.reset();
    closeModal('reportIssueModal');
    
    // Mostrar confirmación
    showModal('confirmationModal', `
        <div class="confirmation-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>تم إرسال البلاغ بنجاح</h3>
            <p>شكراً لك! سيتم مراجعة البلاغ من قبل فريقنا في أقرب وقت ممكن.</p>
            <button class="btn btn-primary close-modal">حسناً</button>
        </div>
    `);
}

// Obtener direcciones a un servicio
function getDirections(locationId) {
    const locationInfo = findLocationById(locationId, {
        civilCentersData,
        hospitalsData,
        policeStationsData
    });
    
    if (locationInfo) {
        const { location, properties } = locationInfo;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${location[0]},${location[1]}&travelmode=driving`;
        window.open(url, '_blank');
    } else {
        showModal('خطأ', 'لم يتم العثور على الموقع المطلوب');
    }
}

// Mostrar analíticas
function showAnalytics(type) {
    Object.values(analyticsLayers).forEach(layer => {
        map.removeLayer(layer);
    });
    document.getElementById('analyticsContent').innerHTML = '';
    if (currentChart) {
        currentChart.destroy();
        currentChart = null;
    }
    switch(type) {
        case 'gaps':
            visualizeServiceGaps();
            map.addLayer(analyticsLayers.serviceGaps);
            showServiceGapsContent();
            break;
        case 'overlap':
            visualizeServiceOverlap();
            map.addLayer(analyticsLayers.serviceOverlap);
            showServiceOverlapContent();
            break;
        case 'temporal':
            visualizeTemporalAnalysis();
            map.addLayer(analyticsLayers.temporalAnalysis);
            showTemporalAnalysisContent();
            break;
        case 'performance':
            visualizePerformanceMetrics();
            map.addLayer(analyticsLayers.performanceMetrics);
            showPerformanceMetricsContent();
            break;
        case 'projects':
            visualizeProjectAnalytics();
            map.addLayer(analyticsLayers.projects);
            showProjectAnalyticsContent();
            break;
        case 'satisfactionPie':
            showSatisfactionPieContent();
            break;
        case 'visitorsLine':
            showVisitorsLineContent();
            break;
        case 'heatmap':
            showHeatmapLayer();
            break;
    }
    document.getElementById('analyticsTitle').textContent = getAnalyticsTitle(type);
    showModal('analyticsModal');
}

function showServiceGapsContent() {
    const content = geoAnalytics.serviceGaps.map(gap => `
        <div class="analytics-section">
            <h3>${gap.area}</h3>
            <p>عدد السكان: ${gap.population}</p>
            <p>أقرب خدمة: ${gap.nearestService}</p>
            <p>المسافة: ${gap.distance} كم</p>
            <h4>التوصيات:</h4>
            <ul>${gap.recommendations.map(r => `<li>${r}</li>`).join('')}</ul>
        </div>
    `).join('');
    document.getElementById('analyticsContent').innerHTML = content;
}

function showServiceOverlapContent() {
    const content = geoAnalytics.serviceOverlap.map(overlap => `
        <div class="analytics-section">
            <h3>${overlap.area}</h3>
            <p>عدد السكان: ${overlap.population}</p>
            <h4>الخدمات المتوفرة:</h4>
            <ul>${overlap.services.map(s => `<li>${s.type}: ${s.count} مركز</li>`).join('')}</ul>
            <h4>التوصيات:</h4>
            <ul>${overlap.recommendations.map(r => `<li>${r}</li>`).join('')}</ul>
        </div>
    `).join('');
    document.getElementById('analyticsContent').innerHTML = content;
}

function showTemporalAnalysisContent() {
    // نصي
    const peakHours = geoAnalytics.temporalAnalysis.peakHours;
    let content = `<div class="analytics-section"><h3>ساعات الذروة</h3><ul>`;
    for (const [hour, visitors] of Object.entries(peakHours)) {
        content += `<li>${hour}: ${visitors} زائر</li>`;
    }
    content += `</ul><h4>التوصيات:</h4><ul>${geoAnalytics.temporalAnalysis.recommendations.map(r => `<li>${r}</li>`).join('')}</ul></div>`;
    document.getElementById('analyticsContent').innerHTML = content;

    // رسم مخطط بياني
    const ctx = document.getElementById('analyticsChart').getContext('2d');
    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(peakHours),
            datasets: [{
                label: 'عدد الزوار',
                data: Object.values(peakHours),
                backgroundColor: '#1e88e5'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function showPerformanceMetricsContent() {
    const byService = geoAnalytics.performanceMetrics.byService;
    let content = '';
    for (const [service, metrics] of Object.entries(byService)) {
        content += `
            <div class="analytics-section">
                <h3>${service}</h3>
                <ul>
                    <li>معدل الرضا: ${metrics.satisfaction}</li>
                    <li>وقت الانتظار: ${metrics.waitingTime}</li>
                    <li>التوفر: ${metrics.availability}%</li>
                    <li>وقت المعالجة المتوسط: ${metrics.processingTime.average}</li>
                    <li>وقت المعالجة في ساعات الذروة: ${metrics.processingTime.peak}</li>
                </ul>
            </div>
        `;
    }
    document.getElementById('analyticsContent').innerHTML = content;
}

function showProjectAnalyticsContent() {
    const ongoing = geoAnalytics.projects.ongoing;
    const planned = geoAnalytics.projects.planned;
    const completed = geoAnalytics.projects.completed;
    let content = '';

    if (ongoing.length) {
        content += `<div class="analytics-section"><h3>مشاريع قيد التنفيذ</h3><ul>`;
        ongoing.forEach(p => {
            content += `<li>${p.name} (${p.progress}%) - ${p.status}</li>`;
        });
        content += `</ul></div>`;
    }
    if (planned.length) {
        content += `<div class="analytics-section"><h3>مشاريع مخططة</h3><ul>`;
        planned.forEach(p => {
            content += `<li>${p.name} - ${p.status}</li>`;
        });
        content += `</ul></div>`;
    }
    if (completed.length) {
        content += `<div class="analytics-section"><h3>مشاريع مكتملة</h3><ul>`;
        completed.forEach(p => {
            content += `<li>${p.name} - ${p.status}</li>`;
        });
        content += `</ul></div>`;
    }
    document.getElementById('analyticsContent').innerHTML = content;
}

// دالة مساعدة للحصول على عنوان التحليل
function getAnalyticsTitle(type) {
    const titles = {
        gaps: 'تحليل فجوات الخدمة',
        overlap: 'تحليل تداخل الخدمات',
        temporal: 'التحليل الزمني',
        performance: 'مؤشرات الأداء',
        projects: 'تحليل المشاريع'
    };
    return titles[type] || 'التحليلات';
}

// تهيئة طبقات التحليل
function initializeAnalyticsLayers() {
    // إضافة طبقات التحليل إلى الخريطة
    Object.values(analyticsLayers).forEach(layer => {
        map.addLayer(layer);
    });
}

// تحليل فجوات الخدمة
function visualizeServiceGaps() {
    analyticsLayers.serviceGaps.clearLayers();
    
    geoAnalytics.serviceGaps.forEach(gap => {
        // إنشاء دائرة نصف قطرها يعتمد على المسافة
        const circle = L.circle(gap.location, {
            radius: gap.distance * 1000, // تحويل الكيلومترات إلى أمتار
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.2
        });
        
        // إضافة علامة في مركز المنطقة
        const marker = L.marker(gap.location, {
            icon: L.divIcon({
                className: 'analytics-marker',
                html: `<div class="gap-marker">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>${gap.area}</span>
                </div>`
            })
        });
        
        // إضافة معلومات إلى النافذة المنبثقة
        const popupContent = `
            <div class="analytics-popup" dir="rtl">
                <h3>${gap.area}</h3>
                <p>عدد السكان: ${gap.population}</p>
                <p>أقرب خدمة: ${gap.nearestService}</p>
                <p>المسافة: ${gap.distance} كم</p>
                <h4>التوصيات:</h4>
                <ul>
                    ${gap.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        `;
        
        circle.bindPopup(popupContent);
        marker.bindPopup(popupContent);
        
        analyticsLayers.serviceGaps.addLayer(circle);
        analyticsLayers.serviceGaps.addLayer(marker);
    });
}

// تحليل تداخل الخدمات
function visualizeServiceOverlap() {
    analyticsLayers.serviceOverlap.clearLayers();
    
    geoAnalytics.serviceOverlap.forEach(overlap => {
        // إنشاء دائرة تمثل منطقة التداخل
        const circle = L.circle(overlap.location, {
            radius: 1000, // 1 كم
            color: 'blue',
            fillColor: '#03f',
            fillOpacity: 0.2
        });
        
        // إضافة علامة في مركز المنطقة
        const marker = L.marker(overlap.location, {
            icon: L.divIcon({
                className: 'analytics-marker',
                html: `<div class="overlap-marker">
                    <i class="fas fa-object-group"></i>
                    <span>${overlap.area}</span>
                </div>`
            })
        });
        
        // إضافة معلومات إلى النافذة المنبثقة
        const popupContent = `
            <div class="analytics-popup" dir="rtl">
                <h3>${overlap.area}</h3>
                <p>عدد السكان: ${overlap.population}</p>
                <h4>الخدمات المتوفرة:</h4>
                <ul>
                    ${overlap.services.map(service => 
                        `<li>${service.type}: ${service.count} مركز</li>`
                    ).join('')}
                </ul>
                <h4>التوصيات:</h4>
                <ul>
                    ${overlap.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        `;
        
        circle.bindPopup(popupContent);
        marker.bindPopup(popupContent);
        
        analyticsLayers.serviceOverlap.addLayer(circle);
        analyticsLayers.serviceOverlap.addLayer(marker);
    });
}

// تحليل الأداء الزمني
function visualizeTemporalAnalysis() {
    analyticsLayers.temporalAnalysis.clearLayers();
    
    // تحليل ساعات الذروة
    const peakHours = geoAnalytics.temporalAnalysis.peakHours;
    const maxVisitors = Math.max(...Object.values(peakHours));
    
    // إضافة علامات لجميع المراكز مع معلومات ساعات الذروة
    Object.values(serviceData).forEach(services => {
        services.forEach(service => {
            const marker = L.marker(service.location, {
                icon: L.divIcon({
                    className: 'analytics-marker',
                    html: `<div class="temporal-marker">
                        <i class="fas fa-clock"></i>
                        <span>${service.name}</span>
                    </div>`
                })
            });
            
            const popupContent = `
                <div class="analytics-popup" dir="rtl">
                    <h3>${service.name}</h3>
                    <h4>ساعات الذروة:</h4>
                    <ul>
                        ${Object.entries(peakHours).map(([time, visitors]) => `
                            <li>${time}: ${visitors} زائر</li>
                        `).join('')}
                    </ul>
                    <h4>التوصيات:</h4>
                    <ul>
                        ${geoAnalytics.temporalAnalysis.recommendations.map(rec => 
                            `<li>${rec}</li>`
                        ).join('')}
                    </ul>
                </div>
            `;
            
            marker.bindPopup(popupContent);
            analyticsLayers.temporalAnalysis.addLayer(marker);
        });
    });
}

// تحليل مؤشرات الأداء
function visualizePerformanceMetrics() {
    analyticsLayers.performanceMetrics.clearLayers();
    
    // إضافة علامات لجميع المراكز مع مؤشرات الأداء
    Object.values(serviceData).forEach(services => {
        services.forEach(service => {
            const performance = geoAnalytics.performanceMetrics.byService[service.type];
            if (performance) {
                const marker = L.marker(service.location, {
                    icon: L.divIcon({
                        className: 'analytics-marker',
                        html: `<div class="performance-marker">
                            <i class="fas fa-chart-line"></i>
                            <span>${service.name}</span>
                        </div>`
                    })
                });
                
                const popupContent = `
                    <div class="analytics-popup" dir="rtl">
                        <h3>${service.name}</h3>
                        <h4>مؤشرات الأداء:</h4>
                        <ul>
                            <li>معدل الرضا: ${performance.satisfaction}</li>
                            <li>وقت الانتظار: ${performance.waitingTime}</li>
                            <li>التوفر: ${performance.availability}%</li>
                            <li>وقت المعالجة المتوسط: ${performance.processingTime.average}</li>
                            <li>وقت المعالجة في ساعات الذروة: ${performance.processingTime.peak}</li>
                        </ul>
                    </div>
                `;
                
                marker.bindPopup(popupContent);
                analyticsLayers.performanceMetrics.addLayer(marker);
            }
        });
    });
}

// تحديث دالة تحليل المشاريع
function visualizeProjectAnalytics() {
    analyticsLayers.projects.clearLayers();
    
    // تحليل المشاريع الجارية
    geoAnalytics.projects.ongoing.forEach(project => {
        const marker = L.marker(project.location, {
            icon: L.divIcon({
                className: 'analytics-marker',
                html: `<div class="project-marker ongoing">
                    <i class="fas fa-hard-hat"></i>
                    <span>${project.name}</span>
                </div>`
            })
        });
        
        const popupContent = `
            <div class="analytics-popup" dir="rtl">
                <h3>${project.name}</h3>
                <p>الحالة: ${project.status}</p>
                <p>نسبة الإنجاز: ${project.progress}%</p>
                <p>تاريخ البدء: ${project.startDate}</p>
                <p>تاريخ الانتهاء المتوقع: ${project.endDate}</p>
                <p>الميزانية: ${project.budget} ل.س</p>
                <h4>التأثير:</h4>
                <ul>
                    ${project.impact.services.map(service => `<li>${service}</li>`).join('')}
                </ul>
                <p>عدد المستفيدين: ${project.impact.beneficiaries}</p>
                <p>تحسين الكفاءة: ${project.impact.efficiency}</p>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        analyticsLayers.projects.addLayer(marker);
    });
    
    // تحليل المشاريع المخططة
    geoAnalytics.projects.planned.forEach(project => {
        const marker = L.marker(project.location, {
            icon: L.divIcon({
                className: 'analytics-marker',
                html: `<div class="project-marker planned">
                    <i class="fas fa-map-marked-alt"></i>
                    <span>${project.name}</span>
                </div>`
            })
        });
        
        const popupContent = `
            <div class="analytics-popup" dir="rtl">
                <h3>${project.name}</h3>
                <p>الحالة: ${project.status}</p>
                <p>تاريخ البدء المتوقع: ${project.startDate}</p>
                <p>تاريخ الانتهاء المتوقع: ${project.endDate}</p>
                <p>الميزانية المخططة: ${project.budget} ل.س</p>
                <h4>التأثير المتوقع:</h4>
                <ul>
                    ${project.impact.services.map(service => `<li>${service}</li>`).join('')}
                </ul>
                <p>عدد المستفيدين المتوقع: ${project.impact.beneficiaries}</p>
                <p>تحسين الكفاءة المتوقع: ${project.impact.efficiency}</p>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        analyticsLayers.projects.addLayer(marker);
    });
    
    // تحليل المشاريع المكتملة
    geoAnalytics.projects.completed.forEach(project => {
        const marker = L.marker(project.location, {
            icon: L.divIcon({
                className: 'analytics-marker',
                html: `<div class="project-marker completed">
                    <i class="fas fa-check-circle"></i>
                    <span>${project.name}</span>
                </div>`
            })
        });
        
        const popupContent = `
            <div class="analytics-popup" dir="rtl">
                <h3>${project.name}</h3>
                <p>الحالة: ${project.status}</p>
                <p>تاريخ الإنجاز: ${project.completionDate}</p>
                <p>الميزانية النهائية: ${project.budget} ل.س</p>
                <h4>التأثير المحقق:</h4>
                <ul>
                    ${project.impact.services.map(service => `<li>${service}</li>`).join('')}
                </ul>
                <p>عدد المستفيدين: ${project.impact.beneficiaries}</p>
                <p>تحسين الكفاءة: ${project.impact.efficiency}</p>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        analyticsLayers.projects.addLayer(marker);
    });
}

// تحديث دالة عرض نموذج التسجيل
function showRegistrationForm(locationId, serviceName) {
    // البحث عن معلومات الخدمة
    const locationInfo = findLocationById(locationId, {
        civilCentersData,
        hospitalsData,
        policeStationsData
    });
    
    if (locationInfo) {
        const { properties } = locationInfo;
        
        // تحديث عنوان النافذة المنبثقة
        document.getElementById('registrationTitle').textContent = 
            `تسجيل طلب خدمة: ${serviceName} - ${properties.name}`;
        
        // تحديث الحقول المخفية
        document.getElementById('locationId').value = locationId;
        document.getElementById('serviceName').value = serviceName;
        
        // تنظيف الحقول السابقة
        document.getElementById('registrationForm').reset();
        
        // إنشاء قائمة الخدمات المتاحة
        const serviceSelect = document.getElementById('serviceType');
        serviceSelect.innerHTML = '<option value="">-- اختر نوع الخدمة --</option>';
        
        // إزالة تعريف serviceFees من هنا (سيتم استخدام التعريف العمومي فقط)
        // Get available services based on the service name passed
        const availableServices = serviceFees[serviceName] || {};
        
        // If no specific services found, try to get them from the properties
        if (Object.keys(availableServices).length === 0 && properties.services) {
            properties.services.forEach(service => {
                const option = document.createElement('option');
                option.value = service;
                option.textContent = service;
                option.dataset.fee = getFeeForService(service);
                serviceSelect.appendChild(option);
            });
        } else {
            // Add services from the serviceFees object
            Object.entries(availableServices).forEach(([service, fee]) => {
                const option = document.createElement('option');
                option.value = service;
                option.textContent = `${service}`;
                option.dataset.fee = fee;
                serviceSelect.appendChild(option);
            });
        }
        
        // تحديث رسوم الخدمة عند تغيير الخدمة
        serviceSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            if (selectedOption && selectedOption.value) {
                const fee = selectedOption.dataset.fee;
                if (fee) {
                    document.getElementById('serviceFee').textContent = `${fee} ل.س`;
                    document.getElementById('totalAmount').textContent = `${fee} ل.س`;
                }
            } else {
                document.getElementById('serviceFee').textContent = '0 ل.س';
                document.getElementById('totalAmount').textContent = '0 ل.س';
            }
        });
        
        // Trigger the change event to set initial fee
        if (serviceSelect.options.length > 0) {
            serviceSelect.dispatchEvent(new Event('change'));
        }
        
        // إنشاء المواعيد المتاحة
        generateTimeSlots(properties.workingHours);
        
        // عرض المستندات المطلوبة
        if (properties.requiredDocuments && properties.requiredDocuments.length > 0) {
            const documentsContainer = document.getElementById('requiredDocuments');
            documentsContainer.innerHTML = '';
            
            properties.requiredDocuments.forEach((doc, index) => {
                const docItem = document.createElement('div');
                docItem.className = 'document-item';
                docItem.innerHTML = `
                    <input type="checkbox" id="doc_${index}" name="documents[]" value="${doc}">
                    <label for="doc_${index}">${doc}</label>
                `;
                documentsContainer.appendChild(docItem);
            });
        }
        
        // تعيين الحد الأدنى للتاريخ (اليوم + 1)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('preferredDate').min = tomorrow.toISOString().split('T')[0];
        
        // Add municipal fields if needed
        if (serviceName === 'خدمات بلدية وعقارية') {
            // Check if municipal fields section already exists
            let municipalFields = document.getElementById('municipalFields');
            
            // Create if it doesn't exist
            if (!municipalFields) {
                municipalFields = document.createElement('div');
                municipalFields.id = 'municipalFields';
                
                // Create the fields
                municipalFields.innerHTML = `
                    <div class="form-group">
                        <label for="propertyInfo">معلومات العقار:</label>
                        <textarea id="propertyInfo" name="propertyInfo" rows="3" placeholder="أدخل رقم العقار والمنطقة العقارية والموقع"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="propertyType">نوع العقار:</label>
                        <select id="propertyType" name="propertyType">
                            <option value="">-- اختر نوع العقار --</option>
                            <option value="سكني">سكني</option>
                            <option value="تجاري">تجاري</option>
                            <option value="صناعي">صناعي</option>
                            <option value="زراعي">زراعي</option>
                            <option value="مختلط">مختلط</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="propertySize">مساحة العقار (م²):</label>
                        <input type="number" id="propertySize" name="propertySize" min="1">
                    </div>
                `;
                
                // Insert before form actions
                const formActions = document.querySelector('.form-actions');
                if (formActions) {
                    formActions.parentNode.insertBefore(municipalFields, formActions);
                }
            } else {
                municipalFields.style.display = 'block';
            }
        } else {
            // Hide municipal fields if they exist
            const municipalFields = document.getElementById('municipalFields');
            if (municipalFields) {
                municipalFields.style.display = 'none';
            }
        }
        
        // عرض النافذة المنبثقة
        showModal('registrationModal');
    } else {
        showModal('خطأ', 'لم يتم العثور على الموقع المطلوب');
    }
}

// دالة معالجة التسجيل
function handleRegistration(locationId, serviceName, form) {
    try {
        // التحقق من وجود النموذج
        if (!form) {
            throw new Error('النموذج غير موجود');
        }

        // التحقق من وجود جميع الحقول المطلوبة
        const requiredFields = [
            'serviceType',
            'fullName',
            'idNumber',
            'phoneNumber',
            'email',
            'preferredDate',
            'preferredTime',
            'paymentMethod'
        ];

        const missingFields = requiredFields.filter(field => !form.elements[field]);
        if (missingFields.length > 0) {
            throw new Error(`الحقول التالية غير موجودة: ${missingFields.join(', ')}`);
        }

        // جمع بيانات النموذج
        const formData = {
            centerId: parseInt(locationId),
            centerName: '',
            serviceType: form.elements.serviceType.value,
            serviceFee: form.elements.serviceType.options[form.elements.serviceType.selectedIndex].dataset.fee,
            fullName: form.elements.fullName.value,
            idNumber: form.elements.idNumber.value,
            phoneNumber: form.elements.phoneNumber.value,
            email: form.elements.email?.value || '',
            notes: form.elements.notes?.value || '',
            preferredDate: form.elements.preferredDate.value,
            preferredTime: form.elements.preferredTime.value,
            requiredDocuments: [],
            paymentMethod: form.elements.paymentMethod.value
        };

        // إضافة بيانات الدفع إذا كانت طريقة الدفع هي بطاقة ائتمان
        if (formData.paymentMethod === 'credit') {
            if (!form.elements.cardNumber || !form.elements.cardExpiry || !form.elements.cardCVV) {
                throw new Error('بيانات البطاقة غير مكتملة');
            }
            formData.cardNumber = form.elements.cardNumber.value;
            formData.cardExpiry = form.elements.cardExpiry.value;
            formData.cardCVV = form.elements.cardCVV.value;
        }
        
        // جمع المستندات المحددة
        const documentCheckboxes = form.querySelectorAll('input[name="documents[]"]:checked');
        documentCheckboxes.forEach(checkbox => {
            formData.requiredDocuments.push(checkbox.value);
        });
        
        // Check for municipal service fields and collect their data
        if (serviceName === 'خدمات بلدية وعقارية') {
            formData.municipalData = {};
            
            // Add property information if available
            if (form.elements.propertyInfo) {
                formData.municipalData.propertyInfo = form.elements.propertyInfo.value;
            }
            
            // Add property type if available
            if (form.elements.propertyType) {
                formData.municipalData.propertyType = form.elements.propertyType.value;
            }
            
            // Add property size if available
            if (form.elements.propertySize) {
                formData.municipalData.propertySize = form.elements.propertySize.value;
            }
        }
        
        // البحث عن معلومات المركز
        const locationInfo = findLocationById(locationId, {
            civilCentersData,
            hospitalsData,
            policeStationsData
        });
        
        if (!locationInfo) {
            throw new Error('لم يتم العثور على معلومات المركز');
        }

        const { location, properties } = locationInfo;
        formData.centerName = properties.name;
        formData.centerAddress = properties.address;
        formData.location = location;
        
        // محاكاة معالجة الدفع
        processElectronicPayment(formData.paymentMethod, formData.serviceType.split(' - ')[1], {
            cardNumber: formData.cardNumber,
            cardExpiry: formData.cardExpiry,
            cardCVV: formData.cardCVV,
            mobileNumber: formData.phoneNumber,
            pin: formData.preferredTime
        })
            .then(response => {
                // إغلاق نافذة التسجيل
                closeModal('registrationModal');
                
                // عرض تأكيد النجاح
                showSuccessMessage({
                    ...response,
                    centerName: formData.centerName,
                    serviceType: formData.serviceType,
                    date: `${formData.preferredDate} - ${formData.preferredTime}`,
                    centerAddress: formData.centerAddress,
                    location: formData.location
                });
            })
            .catch(error => {
                showModal('خطأ في الدفع', error.message);
            });
    } catch (error) {
        console.error('خطأ في معالجة التسجيل:', error);
        showModal('خطأ', error.message || 'حدث خطأ أثناء معالجة طلبك');
    }
}

// دالة معالجة عملية الدفع الإلكتروني
function processElectronicPayment(paymentMethod, amount, options = {}) {
    return new Promise((resolve, reject) => {
        // محاكاة تأخير معالجة الدفع
        setTimeout(() => {
            // تحقق من طريقة الدفع
            switch(paymentMethod) {
                case 'credit':
                    processCreditCardPayment(amount, options)
                        .then(response => resolve(response))
                        .catch(error => reject(error));
                    break;
                case 'syriatel':
                    processMobileWalletPayment('syriatel', amount, options)
                        .then(response => resolve(response))
                        .catch(error => reject(error));
                    break;
                case 'mtn':
                    processMobileWalletPayment('mtn', amount, options)
                        .then(response => resolve(response))
                        .catch(error => reject(error));
                    break;
                case 'cash':
                    processCashPayment(amount, options)
                        .then(response => resolve(response))
                        .catch(error => reject(error));
                    break;
                default:
                    reject(new Error('طريقة دفع غير مدعومة'));
            }
        }, 1500);
    });
}

// دالة معالجة الدفع ببطاقة الائتمان
function processCreditCardPayment(amount, options = {}) {
    return new Promise((resolve, reject) => {
        // تحقق من بيانات البطاقة
        const { cardNumber, cardExpiry, cardCVV } = options;
        
        if (!cardNumber || !cardExpiry || !cardCVV) {
            reject(new Error('معلومات البطاقة غير مكتملة'));
            return;
        }
        
        // تحقق من صحة بيانات البطاقة
        if (cardNumber.length < 16 || cardExpiry.length < 5 || cardCVV.length < 3) {
            reject(new Error('معلومات البطاقة غير صحيحة'));
            return;
        }
        
        // محاكاة نجاح الدفع
        const success = Math.random() > 0.1; // 90% نسبة نجاح
        
        if (success) {
            resolve({
                paymentId: `CARD-${Date.now()}`,
                amount: amount,
                method: 'بطاقة ائتمان',
                status: 'تم الدفع بنجاح',
                lastDigits: cardNumber.slice(-4),
                timestamp: new Date().toISOString()
            });
        } else {
            reject(new Error('فشل في معالجة الدفع. يرجى المحاولة مرة أخرى.'));
        }
    });
}

// دالة معالجة الدفع بالمحفظة الإلكترونية
function processMobileWalletPayment(provider, amount, options = {}) {
    return new Promise((resolve, reject) => {
        // تحقق من بيانات المحفظة
        const { mobileNumber, pin } = options;
        
        if (!mobileNumber) {
            reject(new Error('رقم الهاتف غير موجود'));
            return;
        }
        
        // محاكاة إرسال OTP للمستخدم
        showModal('otpModal', `
            <div class="otp-form" dir="rtl">
                <h3>تأكيد الدفع</h3>
                <p>تم إرسال رمز التحقق إلى الرقم ${mobileNumber}</p>
                <form id="otpForm">
                    <div class="form-group">
                        <label for="otpCode">رمز التحقق</label>
                        <input type="text" id="otpCode" name="otpCode" required>
                    </div>
                    <div class="form-group">
                        <label>المبلغ: ${amount} ل.س</label>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">تأكيد الدفع</button>
                        <button type="button" class="btn btn-secondary close-modal">إلغاء</button>
                    </div>
                </form>
            </div>
        `);
        
        // إضافة معالج الحدث للنموذج
        document.getElementById('otpForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const otpCode = document.getElementById('otpCode').value;
            
            if (!otpCode || otpCode.length < 4) {
                // إظهار رسالة خطأ
                alert('يرجى إدخال رمز التحقق الصحيح');
                return;
            }
            
            // محاكاة نجاح الدفع
            const success = Math.random() > 0.1; // 90% نسبة نجاح
            closeModal('otpModal');
            
            if (success) {
                resolve({
                    paymentId: `${provider.toUpperCase()}-${Date.now()}`,
                    amount: amount,
                    method: provider === 'syriatel' ? 'محفظة سيرياتيل كاش' : 'محفظة MTN كاش',
                    status: 'تم الدفع بنجاح',
                    mobileNumber: mobileNumber,
                    timestamp: new Date().toISOString()
                });
            } else {
                reject(new Error('فشل في معالجة الدفع. يرجى المحاولة مرة أخرى.'));
            }
        });
        
        // إضافة معالج الحدث لزر الإلغاء
        document.querySelector('#otpForm .close-modal').addEventListener('click', function() {
            closeModal('otpModal');
            reject(new Error('تم إلغاء عملية الدفع'));
        });
    });
}

// دالة معالجة الدفع النقدي
function processCashPayment(amount, options = {}) {
    return new Promise((resolve, reject) => {
        // تحقق من بيانات الدفع
        const { locationId, serviceCenter } = options;
        
        // محاكاة نجاح الدفع
        resolve({
            paymentId: `CASH-${Date.now()}`,
            amount: amount,
            method: 'دفع نقدي',
            status: 'انتظار الدفع في المركز',
            serviceCenter: serviceCenter || 'مركز الخدمة',
            timestamp: new Date().toISOString()
        });
    });
}

// دالة محاكاة معالجة الدفع
function processPayment(formData) {
    return new Promise((resolve, reject) => {
        // محاكاة تأخير معالجة الدفع
        setTimeout(() => {
            // محاكاة نجاح الدفع
            const success = Math.random() > 0.1; // 90% نسبة نجاح
            
            if (success) {
                resolve({
                    requestId: generateRequestNumber(),
                    paymentId: `PAY-${Date.now()}`,
                    amount: formData.serviceType.split(' - ')[1],
                    status: 'تم الدفع بنجاح'
                });
            } else {
                reject(new Error('فشل في معالجة الدفع. يرجى المحاولة مرة أخرى.'));
            }
        }, 2000);
    });
}

// Mostrar mensaje de éxito
function showSuccessMessage(data) {
    // Actualizar datos en el modal de éxito
    document.getElementById('requestId').textContent = data.requestId;
    document.getElementById('centerName').textContent = data.centerName;
    document.getElementById('serviceType').textContent = data.serviceType;
    document.getElementById('appointmentDate').textContent = data.date;
    document.getElementById('centerAddress').textContent = data.centerAddress;
    
    // Check if we have municipal data
    if (data.municipalData) {
        // Create municipal info element if it doesn't exist
        let municipalInfo = document.querySelector('.municipal-info');
        if (!municipalInfo) {
            municipalInfo = document.createElement('div');
            municipalInfo.className = 'municipal-info';
            
            // Find where to insert it
            const successDetails = document.querySelector('.success-details');
            if (successDetails) {
                successDetails.appendChild(municipalInfo);
            }
        }
        
        // Populate with municipal data
        let infoHtml = '<h5>معلومات العقار:</h5>';
        
        if (data.municipalData.propertyInfo) {
            infoHtml += `<p><strong>وصف العقار:</strong> ${data.municipalData.propertyInfo}</p>`;
        }
        
        if (data.municipalData.propertyType) {
            infoHtml += `<p><strong>نوع العقار:</strong> ${data.municipalData.propertyType}</p>`;
        }
        
        if (data.municipalData.propertySize) {
            infoHtml += `<p><strong>مساحة العقار:</strong> ${data.municipalData.propertySize} م²</p>`;
        }
        
        municipalInfo.innerHTML = infoHtml;
    } else {
        // Remove municipal info if it exists
        const municipalInfo = document.querySelector('.municipal-info');
        if (municipalInfo) {
            municipalInfo.remove();
        }
    }
    
    // Show modal first
    showModal('successModal');
    
    // Then initialize mini map after modal is visible
    setTimeout(() => {
        const miniMapContainer = document.getElementById('miniMap');
        if (miniMapContainer && data.location) {
            // Clear previous map instance if exists
            miniMapContainer.innerHTML = '';
            
            // Create new map
            const miniMap = L.map('miniMap', {
                center: data.location,
                zoom: 15,
                zoomControl: false,
                dragging: false,
                scrollWheelZoom: false
            });
            
            // Add OpenStreetMap layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(miniMap);
            
            // Add marker
            L.marker(data.location).addTo(miniMap);
        }
    }, 300); // Wait for modal animation to complete
}

// Generar número de solicitud
function generateRequestNumber() {
    const prefix = 'GOV';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
}

// Copiar informe al portapapeles
function copyReport(btn) {
    const requestId = document.getElementById('requestId').textContent;
    const centerName = document.getElementById('centerName').textContent;
    const serviceType = document.getElementById('serviceType').textContent;
    const appointmentDate = document.getElementById('appointmentDate').textContent;
    const centerAddress = document.getElementById('centerAddress').textContent;
    
    const reportText = `
رقم الطلب: ${requestId}
المركز: ${centerName}
الخدمة: ${serviceType}
التاريخ والوقت: ${appointmentDate}
العنوان: ${centerAddress}
    `;
    
    navigator.clipboard.writeText(reportText)
        .then(() => {
            // Cambiar icono temporalmente para indicar éxito
            const originalIcon = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                btn.innerHTML = originalIcon;
            }, 1500);
        })
        .catch(err => {
            console.error('Error al copiar al portapapeles:', err);
        });
}

// Descargar informe como texto
function downloadReport(btn) {
    const requestId = document.getElementById('requestId').textContent;
    const centerName = document.getElementById('centerName').textContent;
    const serviceType = document.getElementById('serviceType').textContent;
    const appointmentDate = document.getElementById('appointmentDate').textContent;
    const centerAddress = document.getElementById('centerAddress').textContent;
    
    const reportText = `
تفاصيل الحجز - بوابة الخدمات الحكومية السورية
-------------------------------------------
رقم الطلب: ${requestId}
المركز: ${centerName}
الخدمة: ${serviceType}
التاريخ والوقت: ${appointmentDate}
العنوان: ${centerAddress}
-------------------------------------------
يرجى الاحتفاظ بهذا المستند وإحضاره معك في موعد الزيارة
    `;
    
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `طلب_خدمة_${requestId}.txt`;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

// Mostrar modal general
function showModal(modalId, content = null) {
    const modal = typeof modalId === 'string' ? document.getElementById(modalId) : modalId;
    
    if (modal) {
        // Si se proporciona contenido, actualizar contenido del modal
        if (content) {
            const modalBody = modal.querySelector('.modal-body');
            if (modalBody) {
                modalBody.innerHTML = content;
                
                // Volver a agregar controladores de eventos a los botones de cerrar
                const closeButtons = modal.querySelectorAll('.close-modal');
                closeButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        closeModal(modal.id);
                    });
                });
            }
        }
        
        modal.classList.add('active');
    }
}

// Cerrar modal
function closeModal(modalId) {
    const modal = typeof modalId === 'string' ? document.getElementById(modalId) : modalId;
    
    if (modal) {
        modal.classList.remove('active');
        
        // Limpiar gráficos si es el modal de analíticas
        if (modalId === 'analyticsModal' && currentChart) {
            currentChart.destroy();
            currentChart = null;
        }
    }
}

// دالة إظهار رسالة تأكيد مع خيارات متعددة
function showConfirmationDialog(title, message, options = {}) {
    // خيارات افتراضية
    const defaultOptions = {
        icon: 'info-circle', // يمكن تغييره إلى: check-circle, exclamation-triangle, question-circle
        iconType: 'info', // يمكن أن يكون: success, warning, info, question
        primaryButtonText: 'موافق',
        secondaryButtonText: 'إلغاء',
        showSecondaryButton: true,
        onConfirm: null,
        onCancel: null,
        details: '',
        showCloseButton: true
    };

    // دمج الخيارات المقدمة مع الخيارات الافتراضية
    const settings = { ...defaultOptions, ...options };

    // اختيار فئة الأيقونة حسب النوع
    let iconClass = 'info';
    if (settings.iconType === 'success') iconClass = 'success';
    else if (settings.iconType === 'warning') iconClass = 'warning';
    else if (settings.iconType === 'question') iconClass = 'question';

    // إنشاء محتوى النافذة
    const content = `
        <div class="confirmation-content">
            <div class="confirmation-icon ${iconClass}">
                <i class="fas fa-${settings.icon}"></i>
            </div>
            <div class="confirmation-message">
                <h3>${title}</h3>
                <p>${message}</p>
                ${settings.details ? `<div class="confirmation-details">${settings.details}</div>` : ''}
            </div>
            <div class="confirmation-actions">
                <button id="confirmBtn" class="btn btn-primary">${settings.primaryButtonText}</button>
                ${settings.showSecondaryButton ? `<button id="cancelBtn" class="btn btn-secondary">${settings.secondaryButtonText}</button>` : ''}
            </div>
        </div>
    `;

    // عرض النافذة المنبثقة
    showModal('confirmationModal', content);

    // إضافة معالجات الأحداث
    const confirmBtn = document.getElementById('confirmBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            closeModal('confirmationModal');
            if (typeof settings.onConfirm === 'function') {
                settings.onConfirm();
            }
        });
    }

    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            closeModal('confirmationModal');
            if (typeof settings.onCancel === 'function') {
                settings.onCancel();
            }
        });
    }

    // إذا كان زر الإغلاق مخفيًا، نخفي زر الإغلاق في العنوان
    if (!settings.showCloseButton) {
        const closeBtn = document.querySelector('#confirmationModal .close-modal');
        if (closeBtn) {
            closeBtn.style.display = 'none';
        }
    }
}

// نماذج رسائل التأكيد المختلفة للاستخدام في التطبيق
function showSuccessConfirmation(message, onConfirm = null) {
    showConfirmationDialog(
        'تم بنجاح', 
        message, 
        {
            icon: 'check-circle',
            iconType: 'success',
            showSecondaryButton: false,
            onConfirm: onConfirm
        }
    );
}

function showWarningConfirmation(message, onConfirm = null, onCancel = null) {
    showConfirmationDialog(
        'تحذير', 
        message, 
        {
            icon: 'exclamation-triangle',
            iconType: 'warning',
            primaryButtonText: 'متابعة',
            onConfirm: onConfirm,
            onCancel: onCancel
        }
    );
}

function showDeleteConfirmation(itemName, onConfirm = null) {
    showConfirmationDialog(
        'تأكيد الحذف', 
        `هل أنت متأكد من رغبتك في حذف "${itemName}"؟`,
        {
            icon: 'trash-alt',
            iconType: 'warning',
            primaryButtonText: 'حذف',
            secondaryButtonText: 'إلغاء',
            details: 'لا يمكن التراجع عن هذه العملية بعد الموافقة عليها.',
            onConfirm: onConfirm
        }
    );
}

function showInfoMessage(title, message, details = '') {
    showConfirmationDialog(
        title, 
        message, 
        {
            icon: 'info-circle',
            iconType: 'info',
            showSecondaryButton: false,
            details: details
        }
    );
}

// دالة إظهار تنبيه بنجاح عملية
function showOperationSuccess(operation, details = '') {
    showConfirmationDialog(
        'تمت العملية بنجاح', 
        `تم ${operation} بنجاح.`, 
        {
            icon: 'check-circle',
            iconType: 'success',
            showSecondaryButton: false,
            details: details
        }
    );
}

// دالة إظهار رسالة شكر للمستخدم
function showThankYouMessage(reason = '') {
    const message = reason ? 
        `شكراً لك على ${reason}. نقدر مساهمتك في تحسين خدماتنا.` : 
        'شكراً لاستخدامك بوابة الخدمات الحكومية الإلكترونية.';
    
    showConfirmationDialog(
        'شكراً لك', 
        message, 
        {
            icon: 'heart',
            iconType: 'success',
            showSecondaryButton: false
        }
    );
}

// Buscar ubicación por ID
function findLocationById(id) {
    const serviceId = parseInt(id);
    
    // Buscar en todas las capas de servicios
    const allData = [
        ...civilCentersData.features,
        ...hospitalsData.features,
        ...policeStationsData.features
    ];
    
    const feature = allData.find(f => f.properties.id === serviceId);
    
    if (feature) {
        const { coordinates } = feature.geometry;
        return {
            location: [coordinates[1], coordinates[0]],
            properties: feature.properties
        };
    }
    
    // Buscar en serviceData
    for (const category in serviceData) {
        const service = serviceData[category].find(s => s.id === serviceId);
        if (service) {
            return {
                location: service.location,
                properties: service
            };
        }
    }
    
    return null;
}

// دالة إنشاء المواعيد المتاحة
function generateTimeSlots(workingHours) {
    const timeSelect = document.getElementById('preferredTime');
    timeSelect.innerHTML = '';
    
    // تحليل ساعات العمل (تنسيق "8:30 - 15:30" أو "24 ساعة")
    if (workingHours === '24 ساعة') {
        // للخدمات على مدار 24 ساعة، إنشاء مواعيد كل ساعة
        for (let hour = 8; hour < 22; hour++) {
            const formattedHour = hour.toString().padStart(2, '0');
            const option = document.createElement('option');
            option.value = `${formattedHour}:00`;
            option.textContent = `${formattedHour}:00`;
            timeSelect.appendChild(option);
        }
    } else {
        // استخراج أوقات البدء والانتهاء
        const times = workingHours.split(' - ');
        if (times.length === 2) {
            let [startTime, endTime] = times;
            
            // تحويل إلى ساعات ودقائق
            const [startHour, startMinute] = startTime.split(':').map(num => parseInt(num));
            const [endHour, endMinute] = endTime.split(':').map(num => parseInt(num));
            
            // إنشاء مواعيد كل 30 دقيقة
            let currentHour = startHour;
            let currentMinute = startMinute;
            
            while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
                const formattedHour = currentHour.toString().padStart(2, '0');
                const formattedMinute = currentMinute.toString().padStart(2, '0');
                
                const option = document.createElement('option');
                option.value = `${formattedHour}:${formattedMinute}`;
                option.textContent = `${formattedHour}:${formattedMinute}`;
                timeSelect.appendChild(option);
                
                // التقدم 30 دقيقة
                currentMinute += 30;
                if (currentMinute >= 60) {
                    currentHour++;
                    currentMinute = 0;
                }
            }
        }
    }
}

// 3. دالة مخطط دائري لرضا المستخدمين
function showSatisfactionPieContent() {
    document.getElementById('analyticsContent').innerHTML = `<div class="analytics-section"><h3>مخطط رضا المستخدمين</h3><p>نسبة رضا المستخدمين عن الخدمات الحكومية.</p></div>`;
    const ctx = document.getElementById('analyticsChart').getContext('2d');
    currentChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['راضٍ جداً', 'راضٍ', 'محايد', 'غير راضٍ'],
            datasets: [{
                data: [40, 35, 15, 10],
                backgroundColor: ['#4caf50', '#2196f3', '#ffc107', '#f44336']
            }]
        },
        options: {
            responsive: true
        }
    });
}

// 4. دالة مخطط خطي لعدد الزوار عبر الزمن
function showVisitorsLineContent() {
    document.getElementById('analyticsContent').innerHTML = `<div class="analytics-section"><h3>عدد الزوار عبر الزمن</h3><p>تطور عدد الزوار خلال اليوم.</p></div>`;
    const peakHours = geoAnalytics.temporalAnalysis.peakHours;
    const ctx = document.getElementById('analyticsChart').getContext('2d');
    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(peakHours),
            datasets: [{
                label: 'عدد الزوار',
                data: Object.values(peakHours),
                borderColor: '#1e88e5',
                backgroundColor: 'rgba(30,136,229,0.1)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true }
            }
        }
    });
}

// 5. دالة طبقة Heatmap (تحتاج إضافة leaflet-heat في HTML)
function showHeatmapLayer() {
    document.getElementById('analyticsContent').innerHTML = `<div class="analytics-section"><h3>خريطة الكثافة الحرارية</h3>
    <p>تعرض المناطق ذات الكثافة الأعلى للزوار أو الطلبات.</p>
    <p>
        <label>نوع الكثافة: </label>
        <select id="heatType">
            <option value="visitors">عدد الزوار</option>
            <option value="requests">عدد الطلبات</option>
            <option value="rating">تقييم المركز</option>
        </select>
    </p>
    </div>`;

    function getAllServiceLocations() {
        let locations = [];
        
        // جمع البيانات من طبقة المراكز المدنية
        civilCentersLayer.eachLayer(layer => {
            if (layer.getLatLng) {
                const pos = layer.getLatLng();
                locations.push({
                    location: [pos.lat, pos.lng],
                    type: 'مراكز مدنية',
                    visitors: Math.floor(Math.random() * 300) + 100,
                    requests: Math.floor(Math.random() * 80) + 20,
                    rating: layer.feature?.properties?.rating || 4
                });
            }
        });

        // جمع البيانات من طبقة المستشفيات
        hospitalsLayer.eachLayer(layer => {
            if (layer.getLatLng) {
                const pos = layer.getLatLng();
                locations.push({
                    location: [pos.lat, pos.lng],
                    type: 'مستشفيات',
                    visitors: Math.floor(Math.random() * 500) + 200,
                    requests: Math.floor(Math.random() * 150) + 50,
                    rating: layer.feature?.properties?.rating || 4
                });
            }
        });

        // جمع البيانات من طبقة مراكز الشرطة
        policeStationsLayer.eachLayer(layer => {
            if (layer.getLatLng) {
                const pos = layer.getLatLng();
                locations.push({
                    location: [pos.lat, pos.lng],
                    type: 'مراكز شرطة',
                    visitors: Math.floor(Math.random() * 200) + 50,
                    requests: Math.floor(Math.random() * 60) + 15,
                    rating: layer.feature?.properties?.rating || 4
                });
            }
        });

        // جمع البيانات من الطبقات الأخرى
        [medicalCentersLayer, educationLayer, postOfficesLayer, governmentOfficesLayer, municipalServicesLayer].forEach(layer => {
            layer.eachLayer(marker => {
                if (marker.getLatLng) {
                    const pos = marker.getLatLng();
                    locations.push({
                        location: [pos.lat, pos.lng],
                        type: 'خدمات أخرى',
                        visitors: Math.floor(Math.random() * 100) + 30,
                        requests: Math.floor(Math.random() * 40) + 10,
                        rating: marker.feature?.properties?.rating || 4
                    });
                }
            });
        });

        return locations;
    }

    function renderHeat(type) {
        let heatData = [];
        let bounds = [];
        const locations = getAllServiceLocations();

        locations.forEach(service => {
            if (service.location && Array.isArray(service.location)) {
                let intensity;
                switch(type) {
                    case 'visitors':
                        intensity = service.visitors;
                        break;
                    case 'requests':
                        intensity = service.requests;
                        break;
                    case 'rating':
                        intensity = service.rating * 20;
                        break;
                    default:
                        intensity = 50;
                }

                heatData.push([service.location[0], service.location[1], intensity]);
                bounds.push(service.location);

                const radius = 0.002;
                for (let angle = 0; angle < 360; angle += 45) {
                    const rad = angle * Math.PI / 180;
                    const lat = service.location[0] + Math.cos(rad) * radius;
                    const lng = service.location[1] + Math.sin(rad) * radius;
                    heatData.push([lat, lng, intensity * 0.7]);
                }
            }
        });

        if (window.heatLayerInstance) {
            map.removeLayer(window.heatLayerInstance);
        }

        window.heatLayerInstance = L.heatLayer(heatData, {
            radius: 30,
            blur: 20,
            maxZoom: 18,
            gradient: {
                0.1: '#3388ff',
                0.3: '#00ff00',
                0.5: '#ffff00',
                0.7: '#ff9900',
                0.9: '#ff0000'
            },
            minOpacity: 0.3
        }).addTo(map);

        if (bounds.length > 0) {
            map.fitBounds(bounds);
        }
    }

    renderHeat('visitors');

    document.getElementById('heatType').addEventListener('change', function() {
        renderHeat(this.value);
    });
}

// دالة عرض هم نافذة تسجيل الدخول
function showLoginForm() {
    const content = `
        <div class="login-container" dir="rtl">
            <form id="loginInnerForm" class="login-form">
                <div class="form-header">
                    <img src="assets/images/syrian-emblem.png" alt="شعار الجمهورية العربية السورية" class="government-logo">
                    <h3>بوابة الخدمات الحكومية الإلكترونية</h3>
                </div>
                <div class="form-group">
                    <label for="nationalID">الرقم الوطني</label>
                    <input type="text" id="nationalID" name="nationalID" required>
                </div>
                <div class="form-group">
                    <label for="password">كلمة المرور</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div class="login-options">
                    <label>
                        <input type="checkbox" id="rememberMe" name="rememberMe">
                        تذكرني
                    </label>
                    <a href="#" class="forgot-password">نسيت كلمة المرور؟</a>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">تسجيل الدخول</button>
                </div>
                <div class="login-help">
                    <p>للمساعدة في تسجيل الدخول، يرجى الاتصال على الرقم: 137</p>
                </div>
            </form>
        </div>
    `;
    
    showModal('loginModal', content);
    
    // Wait for the DOM to update before adding event listener
    setTimeout(() => {
        // إضافة معالج الحدث للنموذج
        const loginForm = document.getElementById('loginInnerForm');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const nationalID = document.getElementById('nationalID').value;
                const password = document.getElementById('password').value;
                
                // محاكاة التحقق من الهوية
                loginWithNationalID(nationalID, password)
                    .then(user => {
                        updateUIAfterLogin(user);
                        closeModal('loginModal');
                        showModal('successModal', `
                            <div class="confirmation-content">
                                <div class="success-icon">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                                <h3>تم تسجيل الدخول بنجاح</h3>
                                <p>مرحباً بك في بوابة الخدمات الحكومية الإلكترونية، ${user.name}!</p>
                                <button class="btn btn-primary close-modal">حسناً</button>
                            </div>
                        `);
                    })
                    .catch(error => {
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'error-message';
                        errorDiv.textContent = error.message;
                        
                        // إزالة أي رسائل خطأ سابقة
                        const previousError = document.querySelector('.error-message');
                        if (previousError) {
                            previousError.remove();
                        }
                        
                        // إضافة رسالة الخطأ
                        const form = document.getElementById('loginInnerForm');
                        form.appendChild(errorDiv);
                    });
            });
        }
    }, 100);
}

// دالة معالجة تسجيل الخروج
function handleLogout() {
    // Reset user state
    currentUser = null;
    isUserLoggedIn = false;
    userDocuments = [];
    userTransactions = [];
    
    // Update UI
    updateUIAfterLogout();
    
    // Show confirmation
    setTimeout(() => {
            showModal('confirmationModal', `
                <div class="confirmation-content">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>تم تسجيل الخروج بنجاح</h3>
                    <p>شكراً لاستخدامك بوابة الخدمات الحكومية الإلكترونية.</p>
                    <button class="btn btn-primary close-modal">حسناً</button>
                </div>
            `);
    }, 100);
}

// دالة عرض المستندات الشخصية
function showUserDocuments() {
    if (!isUserLoggedIn || !currentUser) {
        showLoginForm();
        return;
    }
    
    const documentsContent = userDocuments.map(doc => {
        const expiryDate = new Date(doc.expiryDate);
        const currentDate = new Date();
        const isExpired = expiryDate < currentDate;
        const statusClass = isExpired ? 'document-expired' : 'document-valid';
        const statusText = isExpired ? 'منتهية الصلاحية' : 'سارية المفعول';
        
        return `
            <div class="document-card ${statusClass}">
                <div class="document-icon">
                    <i class="fas ${doc.type === 'بطاقة شخصية' ? 'fa-id-card' : 'fa-passport'}"></i>
                </div>
                <div class="document-info">
                    <h4>${doc.type}</h4>
                    <p>رقم الوثيقة: ${doc.id}</p>
                    <p>تاريخ الإصدار: ${doc.issuedDate}</p>
                    <p>تاريخ الانتهاء: ${doc.expiryDate}</p>
                    <span class="document-status">${statusText}</span>
                </div>
                <div class="document-actions">
                    <button class="btn btn-secondary" onclick="showDocumentDetails('${doc.id}')">
                        <i class="fas fa-eye"></i> عرض التفاصيل
                    </button>
                    ${isExpired ? `
                        <button class="btn btn-primary" onclick="requestDocumentRenewal('${doc.id}')">
                            <i class="fas fa-sync-alt"></i> تجديد
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    const content = `
        <div class="documents-container" dir="rtl">
            <h3>الوثائق الشخصية</h3>
            <div class="documents-list">
                ${documentsContent || '<p>لا توجد وثائق متاحة.</p>'}
            </div>
            <div class="documents-actions">
                <button class="btn btn-primary" onclick="requestNewDocument()">
                    <i class="fas fa-plus-circle"></i> طلب وثيقة جديدة
                </button>
            </div>
        </div>
    `;
    
    showModal('documentsModal', content);
}

// دالة عرض المعاملات السابقة
function showUserTransactions() {
    if (!isUserLoggedIn || !currentUser) {
        showLoginForm();
        return;
    }
    
    const transactionsContent = userTransactions.map(transaction => {
        const statusClass = transaction.status === 'مكتمل' ? 'transaction-completed' : 'transaction-pending';
        
        return `
            <div class="transaction-card ${statusClass}">
                <div class="transaction-icon">
                    <i class="fas fa-file-alt"></i>
                </div>
                <div class="transaction-info">
                    <h4>${transaction.type}</h4>
                    <p>رقم المعاملة: ${transaction.id}</p>
                    <p>تاريخ الطلب: ${transaction.date}</p>
                    <span class="transaction-status">${transaction.status}</span>
                </div>
                <div class="transaction-actions">
                    <button class="btn btn-secondary" onclick="showTransactionDetails('${transaction.id}')">
                        <i class="fas fa-eye"></i> عرض التفاصيل
                    </button>
                    ${transaction.status === 'قيد المعالجة' ? `
                        <button class="btn btn-primary" onclick="checkTransactionStatus('${transaction.id}')">
                            <i class="fas fa-search"></i> متابعة الحالة
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    const content = `
        <div class="transactions-container" dir="rtl">
            <h3>المعاملات السابقة</h3>
            <div class="transactions-list">
                ${transactionsContent || '<p>لا توجد معاملات سابقة.</p>'}
            </div>
        </div>
    `;
    
    showModal('transactionsModal', content);
}

// دالة عرض تفاصيل الوثيقة
function showDocumentDetails(documentId) {
    if (!isUserLoggedIn || !currentUser) {
        showLoginForm();
        return;
    }
    
    const document = userDocuments.find(doc => doc.id === documentId);
    
    if (document) {
        const expiryDate = new Date(document.expiryDate);
        const currentDate = new Date();
        const isExpired = expiryDate < currentDate;
        const statusClass = isExpired ? 'document-expired' : 'document-valid';
        const statusText = isExpired ? 'منتهية الصلاحية' : 'سارية المفعول';
        
        // تحضير معلومات إضافية بناءً على نوع الوثيقة
        let additionalInfo = '';
        
        if (document.type === 'بطاقة شخصية') {
            additionalInfo = `
                <div class="document-additional-info">
                    <h4>معلومات إضافية</h4>
                    <p><strong>الرقم الوطني:</strong> ${document.nationalID || currentUser.id}</p>
                    <p><strong>محل الإقامة:</strong> ${currentUser.address}</p>
                    <p><strong>محل الولادة:</strong> دمشق، سوريا</p>
                    <p><strong>تاريخ الولادة:</strong> 1985-05-15</p>
                    <p><strong>الحالة الاجتماعية:</strong> متزوج</p>
                </div>
            `;
        } else if (document.type === 'جواز سفر') {
            additionalInfo = `
                <div class="document-additional-info">
                    <h4>معلومات إضافية</h4>
                    <p><strong>رقم الجواز:</strong> ${document.passportNumber || 'N0234567'}</p>
                    <p><strong>نوع الجواز:</strong> عادي</p>
                    <p><strong>محل الولادة:</strong> دمشق، سوريا</p>
                    <p><strong>تاريخ الولادة:</strong> 1985-05-15</p>
                    <p><strong>عدد الصفحات:</strong> 48 صفحة</p>
                </div>
            `;
        } else if (document.type === 'إخراج قيد') {
            additionalInfo = `
                <div class="document-additional-info">
                    <h4>معلومات إضافية</h4>
                    <p><strong>رقم السجل:</strong> ${document.regNumber || 'R987654'}</p>
                    <p><strong>محل القيد:</strong> دمشق، الميدان</p>
                    <p><strong>اسم الأب:</strong> أحمد</p>
                    <p><strong>اسم الأم:</strong> فاطمة</p>
                    <p><strong>محل الولادة:</strong> دمشق، سوريا</p>
                    <p><strong>تاريخ الولادة:</strong> 1985-05-15</p>
                </div>
            `;
        } else if (document.type === 'رخصة قيادة') {
            additionalInfo = `
                <div class="document-additional-info">
                    <h4>معلومات إضافية</h4>
                    <p><strong>رقم الرخصة:</strong> ${document.licenseNumber || 'DL123456'}</p>
                    <p><strong>الفئة:</strong> ${document.category || 'فئة B'}</p>
                    <p><strong>تاريخ أول إصدار:</strong> 2010-06-12</p>
                    <p><strong>الفحص الطبي:</strong> لائق</p>
                </div>
            `;
        }
        
        const content = `
            <div class="document-details" dir="rtl">
                <div class="document-header">
                    <h3>${document.type}</h3>
                    <span class="document-status ${statusClass}">${statusText}</span>
                </div>
                <div class="document-card-view">
                    <div class="document-card ${document.type === 'بطاقة شخصية' ? 'id-card' : 'document-generic'}">
                        <div class="card-header">
                            <img src="scit.png" alt="شعار الجمهورية العربية السورية" class="card-emblem">
                            <h4>الجمهورية العربية السورية</h4>
                            <h5>${document.type}</h5>
                        </div>
                        <div class="card-body">
                            <div class="card-photo">
                                <i class="fas fa-user-circle fa-5x"></i>
                            </div>
                            <div class="card-info">
                                <p><strong>الاسم:</strong> ${currentUser.name}</p>
                                <p><strong>الرقم:</strong> ${document.id}</p>
                                <p><strong>تاريخ الإصدار:</strong> ${document.issuedDate}</p>
                                <p><strong>تاريخ الانتهاء:</strong> ${document.expiryDate}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="document-content">
                    <div class="document-info">
                        <h4>بيانات الوثيقة</h4>
                        <p><strong>رقم الوثيقة:</strong> ${document.id}</p>
                        <p><strong>اسم المواطن:</strong> ${currentUser.name}</p>
                        <p><strong>الرقم الوطني:</strong> ${currentUser.id}</p>
                        <p><strong>تاريخ الإصدار:</strong> ${document.issuedDate}</p>
                        <p><strong>تاريخ الانتهاء:</strong> ${document.expiryDate}</p>
                        <p><strong>جهة الإصدار:</strong> ${document.issuePlace || 'وزارة الداخلية - المديرية العامة للأحوال المدنية'}</p>
                    </div>
                    ${additionalInfo}
                    <div class="document-qr">
                        <div class="qr-code">
                            <!-- سيتم إنشاء رمز QR حقيقي في التطبيق النهائي -->
                            <div style="width: 100px; height: 100px; background-color: #f5f5f5; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-qrcode fa-3x"></i>
                            </div>
                        </div>
                        <p>يمكن التحقق من صحة هذه الوثيقة عبر مسح الرمز أعلاه</p>
                    </div>
                </div>
                <div class="document-actions">
                    <button class="btn btn-secondary" onclick="printDocument('${document.id}')">
                        <i class="fas fa-print"></i> طباعة
                    </button>
                    <button class="btn btn-secondary" onclick="downloadDocument('${document.id}')">
                        <i class="fas fa-download"></i> تحميل
                    </button>
                    ${isExpired ? `
                        <button class="btn btn-primary" onclick="requestDocumentRenewal('${document.id}')">
                            <i class="fas fa-sync-alt"></i> تجديد
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        
        showModal('documentDetailsModal', content);
    } else {
        showModal('خطأ', 'لم يتم العثور على الوثيقة المطلوبة');
    }
}

// دالة عرض تفاصيل المعاملة
function showTransactionDetails(transactionId) {
    if (!isUserLoggedIn || !currentUser) {
        showLoginForm();
        return;
    }
    
    const transaction = userTransactions.find(trx => trx.id === transactionId);
    
    if (transaction) {
        // محاكاة خطوات المعاملة - استخدام تاريخ المعاملة الفعلي
        const transactionDate = new Date(transaction.date);
        const nextDay = new Date(transactionDate);
        nextDay.setDate(nextDay.getDate() + 1);
        const thirdDay = new Date(nextDay);
        thirdDay.setDate(thirdDay.getDate() + 1);
        const fourthDay = new Date(thirdDay);
        fourthDay.setDate(fourthDay.getDate() + 1);
        
        // تنسيق التواريخ
        const formatDate = (date) => {
            return date.toISOString().split('T')[0];
        };
        
        const steps = [
            { 
                name: "تقديم الطلب", 
                date: formatDate(transactionDate), 
                status: "مكتمل",
                description: "تم تقديم الطلب بنجاح وحفظه في النظام"
            },
            { 
                name: "فحص الوثائق", 
                date: formatDate(nextDay), 
                status: "مكتمل",
                description: "تم التحقق من صحة البيانات والوثائق المرفقة"
            },
            { 
                name: "موافقة المسؤول", 
                date: transaction.status === 'مكتمل' ? formatDate(thirdDay) : "-", 
                status: transaction.status === 'مكتمل' ? "مكتمل" : "قيد الانتظار",
                description: transaction.status === 'مكتمل' ? 
                    "تمت الموافقة من قبل المسؤول المختص" : 
                    "في انتظار موافقة المسؤول المختص"
            },
            { 
                name: "إصدار الوثيقة", 
                date: transaction.status === 'مكتمل' ? formatDate(fourthDay) : "-", 
                status: transaction.status === 'مكتمل' ? "مكتمل" : "قيد الانتظار",
                description: transaction.status === 'مكتمل' ? 
                    "تم إصدار الوثيقة وهي جاهزة للاستلام" : 
                    "سيتم إصدار الوثيقة بعد اكتمال الخطوات السابقة"
            }
        ];
        
        const stepsHtml = steps.map((step, index) => {
            const stepClass = step.status === "مكتمل" ? "step-completed" : "step-pending";
            return `
                <div class="transaction-step ${stepClass}">
                    <div class="step-number">${index + 1}</div>
                    <div class="step-icon">
                        <i class="fas ${step.status === "مكتمل" ? "fa-check-circle" : "fa-clock"}"></i>
                    </div>
                    <div class="step-info">
                        <h5>${step.name}</h5>
                        <p class="step-date">${step.date !== "-" ? step.date : "لم يتم بعد"}</p>
                        <p class="step-description">${step.description}</p>
                        <span class="step-status">${step.status}</span>
                    </div>
                </div>
                ${index < steps.length - 1 ? '<div class="step-connector"></div>' : ''}
            `;
        }).join('');
        
        // إضافة معلومات إضافية بناءً على نوع المعاملة
        let additionalInfo = '';
        if (transaction.property) {
            additionalInfo = `
                <div class="transaction-property-info">
                    <h4>معلومات العقار</h4>
                    <p>${transaction.property}</p>
                </div>
            `;
        }
        
        // إضافة معلومات الرسوم والدفع
        const paymentInfo = transaction.fee ? `
            <div class="transaction-payment">
                <h4>معلومات الدفع</h4>
                <p><strong>الرسوم:</strong> ${transaction.fee} ل.س</p>
                <p><strong>طريقة الدفع:</strong> ${transaction.paymentMethod || 'نقداً'}</p>
                <p><strong>حالة الدفع:</strong> <span class="payment-status completed">تم الدفع</span></p>
                <p><strong>رقم المرجع:</strong> ${transaction.reference || '-'}</p>
            </div>
        ` : '';
        
        // معلومات مركز الخدمة
        const centerInfo = transaction.center ? `
            <div class="transaction-center">
                <h4>مركز الخدمة</h4>
                <p><strong>اسم المركز:</strong> ${transaction.center}</p>
                <p><strong>العنوان:</strong> ${transaction.centerAddress || 'دمشق، سوريا'}</p>
                ${transaction.status === 'مكتمل' ? `
                    <p><strong>تاريخ الاستلام:</strong> ${transaction.completionDate || '-'}</p>
                ` : `
                    <p><strong>التاريخ المتوقع للاستلام:</strong> ${transaction.estimatedCompletion || '-'}</p>
                `}
            </div>
        ` : '';
        
        const content = `
            <div class="transaction-details" dir="rtl">
                <div class="transaction-header">
                    <div class="transaction-title">
                        <h3>${transaction.type}</h3>
                        <span class="transaction-id">${transaction.id}</span>
                    </div>
                    <span class="transaction-status ${transaction.status === 'مكتمل' ? 'transaction-completed' : 'transaction-pending'}">
                        <i class="fas ${transaction.status === 'مكتمل' ? 'fa-check-circle' : 'fa-clock'}"></i>
                        ${transaction.status}
                    </span>
                </div>
                
                <div class="transaction-summary">
                    <div class="summary-item">
                        <div class="summary-icon"><i class="fas fa-calendar"></i></div>
                        <div class="summary-info">
                            <span class="summary-label">تاريخ الطلب</span>
                            <span class="summary-value">${transaction.date}</span>
                        </div>
                    </div>
                    
                    <div class="summary-item">
                        <div class="summary-icon"><i class="fas fa-user"></i></div>
                        <div class="summary-info">
                            <span class="summary-label">مقدم الطلب</span>
                            <span class="summary-value">${currentUser.name}</span>
                        </div>
                    </div>
                    
                    <div class="summary-item">
                        <div class="summary-icon"><i class="fas fa-money-bill-alt"></i></div>
                        <div class="summary-info">
                            <span class="summary-label">الرسوم</span>
                            <span class="summary-value">${transaction.fee || '0'} ل.س</span>
                        </div>
                    </div>
                    
                    <div class="summary-item">
                        <div class="summary-icon"><i class="fas fa-building"></i></div>
                        <div class="summary-info">
                            <span class="summary-label">مركز الخدمة</span>
                            <span class="summary-value">${transaction.center || 'غير محدد'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="transaction-progress">
                    <h4>مراحل المعاملة</h4>
                    <div class="transaction-timeline">
                        ${stepsHtml}
                    </div>
                </div>
                
                <div class="transaction-content">
                    <div class="transaction-info">
                        <h4>معلومات المعاملة</h4>
                        <p><strong>نوع المعاملة:</strong> ${transaction.type}</p>
                        <p><strong>رقم المعاملة:</strong> ${transaction.id}</p>
                        <p><strong>تاريخ الطلب:</strong> ${transaction.date}</p>
                        <p><strong>اسم المواطن:</strong> ${currentUser.name}</p>
                        <p><strong>الرقم الوطني:</strong> ${currentUser.id}</p>
                        <p><strong>الجهة المسؤولة:</strong> ${transaction.authority || 'وزارة الداخلية - المديرية العامة للأحوال المدنية'}</p>
                    </div>
                    
                    ${additionalInfo}
                    ${paymentInfo}
                    ${centerInfo}
                </div>
                
                <div class="transaction-actions">
                    <button class="btn btn-secondary" onclick="printTransaction('${transaction.id}')">
                        <i class="fas fa-print"></i> طباعة
                    </button>
                    <button class="btn btn-secondary" onclick="downloadTransaction('${transaction.id}')">
                        <i class="fas fa-download"></i> تحميل
                    </button>
                    ${transaction.status !== 'مكتمل' ? `
                        <button class="btn btn-primary" onclick="checkTransactionStatus('${transaction.id}')">
                            <i class="fas fa-search"></i> متابعة الحالة
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        
        showModal('transactionDetailsModal', content);
    } else {
        showModal('خطأ', 'لم يتم العثور على المعاملة المطلوبة');
    }
}

// دالة طلب تجديد وثيقة
function requestDocumentRenewal(documentId) {
    if (!isUserLoggedIn || !currentUser) {
        showLoginForm();
        return;
    }
    
    const document = userDocuments.find(doc => doc.id === documentId);
    
    if (document) {
        const content = `
            <div class="renewal-form" dir="rtl">
                <h3>طلب تجديد ${document.type}</h3>
                <form id="renewalForm">
                    <input type="hidden" name="documentId" value="${document.id}">
                    <div class="form-group">
                        <label for="renewalReason">سبب التجديد</label>
                        <select id="renewalReason" name="renewalReason" required>
                            <option value="">-- اختر السبب --</option>
                            <option value="انتهاء الصلاحية">انتهاء الصلاحية</option>
                            <option value="تلف">تلف</option>
                            <option value="فقدان">فقدان</option>
                            <option value="تغيير معلومات">تغيير معلومات</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="renewalNotes">ملاحظات إضافية</label>
                        <textarea id="renewalNotes" name="renewalNotes" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="preferredCenter">المركز المفضل لاستلام الوثيقة</label>
                        <select id="preferredCenter" name="preferredCenter" required>
                            <option value="">-- اختر المركز --</option>
                            <option value="مركز الميدان للخدمات">مركز الميدان للخدمات</option>
                            <option value="مركز القابون للخدمات">مركز القابون للخدمات</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">تقديم طلب التجديد</button>
                        <button type="button" class="btn btn-secondary close-modal">إلغاء</button>
                    </div>
                </form>
            </div>
        `;
        
        showModal('renewalModal', content);
        
        // إضافة معالج الحدث للنموذج
        document.getElementById('renewalForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // محاكاة تقديم طلب التجديد
            setTimeout(() => {
                closeModal('renewalModal');
                
                // إضافة معاملة جديدة للتجديد
                const newTransaction = {
                    id: `TRX-${Date.now()}`,
                    type: `تجديد ${document.type}`,
                    date: new Date().toISOString().slice(0, 10),
                    status: "قيد المعالجة"
                };
                
                userTransactions.push(newTransaction);
                
                showModal('successModal', `
                    <div class="confirmation-content">
                        <div class="success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h3>تم تقديم طلب التجديد بنجاح</h3>
                        <p>رقم المعاملة: ${newTransaction.id}</p>
                        <p>يمكنك متابعة حالة طلبك من خلال قائمة "معاملاتي".</p>
                        <button class="btn btn-primary close-modal">حسناً</button>
                    </div>
                `);
            }, 1500);
        });
    } else {
        showModal('خطأ', 'لم يتم العثور على الوثيقة المطلوبة');
    }
}

// دالة طلب وثيقة جديدة
function requestNewDocument() {
    if (!isUserLoggedIn || !currentUser) {
        showLoginForm();
        return;
    }
    
    const content = `
        <div class="new-document-form" dir="rtl">
            <h3>طلب وثيقة جديدة</h3>
            <form id="newDocumentForm">
                <div class="form-group">
                    <label for="documentType">نوع الوثيقة</label>
                    <select id="documentType" name="documentType" required>
                        <option value="">-- اختر نوع الوثيقة --</option>
                        <option value="بطاقة شخصية">بطاقة شخصية</option>
                        <option value="جواز سفر">جواز سفر</option>
                        <option value="شهادة ميلاد">شهادة ميلاد</option>
                        <option value="إخراج قيد">إخراج قيد</option>
                        <option value="دفتر عائلة">دفتر عائلة</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="documentPurpose">الغرض من الوثيقة</label>
                    <select id="documentPurpose" name="documentPurpose" required>
                        <option value="">-- اختر الغرض --</option>
                        <option value="سفر">سفر</option>
                        <option value="عمل">عمل</option>
                        <option value="دراسة">دراسة</option>
                        <option value="زواج">زواج</option>
                        <option value="أخرى">أخرى</option>
                    </select>
                </div>
                <div class="form-group document-fee">
                    <label>الرسوم المطلوبة:</label>
                    <p id="documentFee">0 ل.س</p>
                </div>
                <div class="form-group">
                    <label for="preferredCenter">المركز المفضل لاستلام الوثيقة</label>
                    <select id="preferredCenter" name="preferredCenter" required>
                        <option value="">-- اختر المركز --</option>
                        <option value="مركز الميدان للخدمات">مركز الميدان للخدمات</option>
                        <option value="مركز القابون للخدمات">مركز القابون للخدمات</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="paymentMethod">طريقة الدفع</label>
                    <select id="paymentMethod" name="paymentMethod" required>
                        <option value="">-- اختر طريقة الدفع --</option>
                        <option value="cash">الدفع النقدي في المركز</option>
                        <option value="credit">بطاقة ائتمان</option>
                        <option value="syriatel">محفظة سيرياتيل كاش</option>
                        <option value="mtn">محفظة MTN كاش</option>
                    </select>
                </div>
                <div id="creditCardFields" class="form-group" style="display: none;">
                    <label for="cardNumber">رقم البطاقة</label>
                    <input type="text" id="cardNumber" name="cardNumber" placeholder="XXXX-XXXX-XXXX-XXXX">
                    <div class="card-details">
                        <div>
                            <label for="cardExpiry">تاريخ الانتهاء</label>
                            <input type="text" id="cardExpiry" name="cardExpiry" placeholder="MM/YY">
                        </div>
                        <div>
                            <label for="cardCVV">رمز التحقق</label>
                            <input type="text" id="cardCVV" name="cardCVV" placeholder="CVV">
                        </div>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">تقديم الطلب</button>
                    <button type="button" class="btn btn-secondary close-modal">إلغاء</button>
                </div>
            </form>
        </div>
    `;
    
    showModal('newDocumentModal', content);
    
    // تحديث رسوم الوثيقة عند تغيير نوع الوثيقة
    document.getElementById('documentType').addEventListener('change', function() {
        const documentType = this.value;
        let fee = 0;
        
        switch(documentType) {
            case 'بطاقة شخصية':
                fee = 5000;
                break;
            case 'جواز سفر':
                fee = 15000;
                break;
            case 'شهادة ميلاد':
                fee = 2000;
                break;
            case 'إخراج قيد':
                fee = 3000;
                break;
            case 'دفتر عائلة':
                fee = 7000;
                break;
        }
        
        document.getElementById('documentFee').textContent = `${fee} ل.س`;
    });
    
    // إظهار/إخفاء حقول بطاقة الائتمان
    document.getElementById('paymentMethod').addEventListener('change', function() {
        const creditCardFields = document.getElementById('creditCardFields');
        creditCardFields.style.display = this.value === 'credit' ? 'block' : 'none';
    });
    
    // إضافة معالج الحدث للنموذج
    document.getElementById('newDocumentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const documentType = document.getElementById('documentType').value;
        const documentPurpose = document.getElementById('documentPurpose').value;
        const preferredCenter = document.getElementById('preferredCenter').value;
        const paymentMethod = document.getElementById('paymentMethod').value;
        
        // محاكاة تقديم طلب وثيقة جديدة
        setTimeout(() => {
            closeModal('newDocumentModal');
            
            // إضافة معاملة جديدة للوثيقة
            const newTransaction = {
                id: `TRX-${Date.now()}`,
                type: `إصدار ${documentType}`,
                date: new Date().toISOString().slice(0, 10),
                status: "قيد المعالجة"
            };
            
            userTransactions.push(newTransaction);
            
            showModal('successModal', `
                <div class="confirmation-content">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>تم تقديم طلب الوثيقة بنجاح</h3>
                    <p>رقم المعاملة: ${newTransaction.id}</p>
                    <p>نوع الوثيقة: ${documentType}</p>
                    <p>المركز المختار: ${preferredCenter}</p>
                    <p>يمكنك متابعة حالة طلبك من خلال قائمة "معاملاتي".</p>
                    <button class="btn btn-primary close-modal">حسناً</button>
                </div>
            `);
        }, 1500);
    });
}

// دالة متابعة حالة المعاملة
function checkTransactionStatus(transactionId) {
    if (!isUserLoggedIn || !currentUser) {
        showLoginForm();
        return;
    }
    
    const transaction = userTransactions.find(trx => trx.id === transactionId);
    
    if (transaction) {
        // محاكاة التحقق من حالة المعاملة
        setTimeout(() => {
            showTransactionDetails(transactionId);
        }, 1000);
    } else {
        showModal('خطأ', 'لم يتم العثور على المعاملة المطلوبة');
    }
}

// دالة عرض لوحة المعلومات التحليلية للخدمات الحكومية
function showGovernmentDashboard() {
    if (!isUserLoggedIn) {
        showLoginForm();
        return;
    }
    
    // تحقق مما إذا كان المستخدم لديه صلاحيات إدارية
    if (currentUser && currentUser.role !== 'admin') {
        showModal('تنبيه', 'عذراً، ليس لديك صلاحية للوصول إلى لوحة المعلومات الإدارية.');
        return;
    }
    
    // بيانات تحليلية للخدمات الحكومية (بيانات وهمية)
    const dashboardData = {
        servicesTotal: 58463,
        servicesByRegion: {
            "دمشق": 12567,
            "حلب": 10432,
            "حمص": 7845,
            "اللاذقية": 6543,
            "حماة": 5976,
            "طرطوس": 4329,
            "دير الزور": 3621,
            "الرقة": 2981,
            "الحسكة": 2134,
            "درعا": 1258,
            "إدلب": 856,
            "القنيطرة": 754,
            "السويداء": 1167
        },
        servicesByType: {
            "بطاقات شخصية": 15678,
            "جوازات سفر": 12345,
            "شهادات ميلاد": 7890,
            "إخراج قيد": 6543,
            "تسجيل عقاري": 5432,
            "معاملات بلدية": 4321,
            "وثائق تعليمية": 3210,
            "تراخيص بناء": 2109,
            "خدمات أخرى": 1235
        },
        serviceTimeAverage: {
            "بطاقات شخصية": 20,
            "جوازات سفر": 25,
            "شهادات ميلاد": 15,
            "إخراج قيد": 12,
            "تسجيل عقاري": 35,
            "معاملات بلدية": 30,
            "وثائق تعليمية": 18,
            "تراخيص بناء": 45,
            "خدمات أخرى": 22
        },
        userSatisfaction: {
            "ممتاز": 40,
            "جيد جداً": 25,
            "جيد": 20,
            "متوسط": 10,
            "ضعيف": 5
        },
        dailyServices: {
            "8:00": 120,
            "9:00": 180,
            "10:00": 250,
            "11:00": 300,
            "12:00": 280,
            "13:00": 200,
            "14:00": 150,
            "15:00": 100
        },
        weeklyTrends: {
            "الأحد": 1200,
            "الإثنين": 1450,
            "الثلاثاء": 1300,
            "الأربعاء": 1350,
            "الخميس": 1500,
            "الجمعة": 700,
            "السبت": 800
        },
        digitalServicesUsage: 65, // نسبة استخدام الخدمات الإلكترونية
        paperServicesUsage: 35, // نسبة استخدام الخدمات الورقية
        ePaymentAdoption: 42, // نسبة استخدام الدفع الإلكتروني
        mobileAppUsage: 38, // نسبة استخدام تطبيق الهاتف المحمول
        websiteVisits: 28563, // عدد زيارات الموقع الشهرية
        appDownloads: 12541 // عدد تنزيلات التطبيق
    };
    
    // إنشاء محتوى لوحة المعلومات
    const content = `
        <div class="dashboard-container" dir="rtl">
            <div class="dashboard-header">
                <h2>لوحة معلومات الخدمات الحكومية</h2>
                <div class="dashboard-date">
                    <span>${new Date().toLocaleDateString('ar-SY')}</span>
                </div>
            </div>
            
            <div class="dashboard-summary">
                <div class="summary-card">
                    <div class="card-icon"><i class="fas fa-file-alt"></i></div>
                    <div class="card-content">
                        <h3>إجمالي الخدمات</h3>
                        <p class="card-value">${dashboardData.servicesTotal.toLocaleString()}</p>
                        <p class="card-change positive">+3.2% منذ الشهر الماضي</p>
                    </div>
                </div>
                
                <div class="summary-card">
                    <div class="card-icon"><i class="fas fa-mobile-alt"></i></div>
                    <div class="card-content">
                        <h3>الخدمات الإلكترونية</h3>
                        <p class="card-value">${dashboardData.digitalServicesUsage}%</p>
                        <p class="card-change positive">+5.7% منذ الشهر الماضي</p>
                    </div>
                </div>
                
                <div class="summary-card">
                    <div class="card-icon"><i class="fas fa-credit-card"></i></div>
                    <div class="card-content">
                        <h3>استخدام الدفع الإلكتروني</h3>
                        <p class="card-value">${dashboardData.ePaymentAdoption}%</p>
                        <p class="card-change positive">+4.3% منذ الشهر الماضي</p>
                    </div>
                </div>
                
                <div class="summary-card">
                    <div class="card-icon"><i class="fas fa-smile"></i></div>
                    <div class="card-content">
                        <h3>رضا المستخدمين</h3>
                        <p class="card-value">${dashboardData.userSatisfaction["ممتاز"] + dashboardData.userSatisfaction["جيد جداً"]}%</p>
                        <p class="card-change positive">+2.1% منذ الشهر الماضي</p>
                    </div>
                </div>
            </div>
            
            <div class="dashboard-charts">
                <div class="chart-container">
                    <h3>الخدمات حسب المحافظة</h3>
                    <canvas id="regionChart"></canvas>
                </div>
                
                <div class="chart-container">
                    <h3>الخدمات حسب النوع</h3>
                    <canvas id="typeChart"></canvas>
                </div>
                
                <div class="chart-container">
                    <h3>متوسط وقت المعاملة (دقائق)</h3>
                    <canvas id="timeChart"></canvas>
                </div>
                
                <div class="chart-container">
                    <h3>معدل الخدمات اليومي</h3>
                    <canvas id="dailyChart"></canvas>
                </div>
            </div>
            
            <div class="dashboard-details">
                <div class="detail-section">
                    <h3>توزيع استخدام الخدمات</h3>
                    <div class="distribution-container">
                        <div class="distribution-item">
                            <h4>الخدمات الإلكترونية</h4>
                            <div class="progress-bar">
                                <div class="progress" style="width: ${dashboardData.digitalServicesUsage}%"></div>
                            </div>
                            <p>${dashboardData.digitalServicesUsage}%</p>
                        </div>
                        <div class="distribution-item">
                            <h4>الخدمات الورقية</h4>
                            <div class="progress-bar">
                                <div class="progress" style="width: ${dashboardData.paperServicesUsage}%"></div>
                            </div>
                            <p>${dashboardData.paperServicesUsage}%</p>
                        </div>
                        <div class="distribution-item">
                            <h4>استخدام الدفع الإلكتروني</h4>
                            <div class="progress-bar">
                                <div class="progress" style="width: ${dashboardData.ePaymentAdoption}%"></div>
                            </div>
                            <p>${dashboardData.ePaymentAdoption}%</p>
                        </div>
                        <div class="distribution-item">
                            <h4>استخدام تطبيق الهاتف</h4>
                            <div class="progress-bar">
                                <div class="progress" style="width: ${dashboardData.mobileAppUsage}%"></div>
                            </div>
                            <p>${dashboardData.mobileAppUsage}%</p>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>الخدمات الأكثر طلباً</h3>
                    <table class="dashboard-table">
                        <thead>
                            <tr>
                                <th>الخدمة</th>
                                <th>العدد</th>
                                <th>متوسط الوقت (دقائق)</th>
                                <th>نسبة التغيير</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>بطاقات شخصية</td>
                                <td>${dashboardData.servicesByType["بطاقات شخصية"].toLocaleString()}</td>
                                <td>${dashboardData.serviceTimeAverage["بطاقات شخصية"]}</td>
                                <td class="positive">+4.2%</td>
                            </tr>
                            <tr>
                                <td>جوازات سفر</td>
                                <td>${dashboardData.servicesByType["جوازات سفر"].toLocaleString()}</td>
                                <td>${dashboardData.serviceTimeAverage["جوازات سفر"]}</td>
                                <td class="positive">+6.7%</td>
                            </tr>
                            <tr>
                                <td>شهادات ميلاد</td>
                                <td>${dashboardData.servicesByType["شهادات ميلاد"].toLocaleString()}</td>
                                <td>${dashboardData.serviceTimeAverage["شهادات ميلاد"]}</td>
                                <td class="positive">+3.5%</td>
                            </tr>
                            <tr>
                                <td>إخراج قيد</td>
                                <td>${dashboardData.servicesByType["إخراج قيد"].toLocaleString()}</td>
                                <td>${dashboardData.serviceTimeAverage["إخراج قيد"]}</td>
                                <td class="positive">+2.8%</td>
                            </tr>
                            <tr>
                                <td>تسجيل عقاري</td>
                                <td>${dashboardData.servicesByType["تسجيل عقاري"].toLocaleString()}</td>
                                <td>${dashboardData.serviceTimeAverage["تسجيل عقاري"]}</td>
                                <td class="negative">-1.2%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="dashboard-footer">
                <button class="btn btn-primary" onclick="printDashboard()">
                    <i class="fas fa-print"></i> طباعة التقرير
                </button>
                <button class="btn btn-secondary" onclick="exportDashboardData()">
                    <i class="fas fa-file-export"></i> تصدير البيانات
                </button>
                <button class="btn btn-secondary close-modal">
                    <i class="fas fa-times"></i> إغلاق
                </button>
            </div>
        </div>
    `;
    
    showModal('dashboardModal', content);
    
    // رسم المخططات البيانية بعد ظهور النافذة
    setTimeout(() => {
        // مخطط توزيع الخدمات حسب المحافظة
        const regionCtx = document.getElementById('regionChart').getContext('2d');
        new Chart(regionCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(dashboardData.servicesByRegion),
                datasets: [{
                    label: 'عدد الخدمات',
                    data: Object.values(dashboardData.servicesByRegion),
                    backgroundColor: '#1e88e5'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });
        
        // مخطط توزيع الخدمات حسب النوع
        const typeCtx = document.getElementById('typeChart').getContext('2d');
        new Chart(typeCtx, {
            type: 'pie',
            data: {
                labels: Object.keys(dashboardData.servicesByType),
                datasets: [{
                    data: Object.values(dashboardData.servicesByType),
                    backgroundColor: [
                        '#1e88e5', '#4caf50', '#ff9800', '#e53935', 
                        '#9c27b0', '#009688', '#f44336', '#3f51b5', '#ffc107'
                    ]
                }]
            },
            options: {
                responsive: true
            }
        });
        
        // مخطط متوسط وقت المعاملة
        const timeCtx = document.getElementById('timeChart').getContext('2d');
        new Chart(timeCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(dashboardData.serviceTimeAverage),
                datasets: [{
                    label: 'الوقت (دقائق)',
                    data: Object.values(dashboardData.serviceTimeAverage),
                    backgroundColor: '#4caf50'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });
        
        // مخطط معدل الخدمات اليومي
        const dailyCtx = document.getElementById('dailyChart').getContext('2d');
        new Chart(dailyCtx, {
            type: 'line',
            data: {
                labels: Object.keys(dashboardData.dailyServices),
                datasets: [{
                    label: 'عدد الخدمات',
                    data: Object.values(dashboardData.dailyServices),
                    borderColor: '#ff9800',
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    fill: true
                }]
            },
            options: {
                responsive: true
            }
        });
    }, 300);
}

// دالة طباعة لوحة المعلومات
function printDashboard() {
    window.print();
}

// دالة تصدير بيانات لوحة المعلومات
function exportDashboardData() {
    alert('جاري تصدير البيانات...');
    // في التطبيق الحقيقي، سيتم تصدير البيانات إلى ملف CSV أو Excel
}

// دالة لطباعة تفاصيل وثيقة
function printDocument(documentId) {
    // في التطبيق الحقيقي، سيتم إنشاء نسخة للطباعة من الوثيقة
    window.print();
}

// دالة لتحميل وثيقة
function downloadDocument(documentId) {
    const document = userDocuments.find(doc => doc.id === documentId);
    
    if (document) {
        // إنشاء محتوى النص للتحميل
        const content = `
بيانات الوثيقة - بوابة الخدمات الحكومية السورية
------------------------------------------
نوع الوثيقة: ${document.type}
رقم الوثيقة: ${document.id}
اسم المواطن: ${currentUser.name}
الرقم الوطني: ${currentUser.id}
تاريخ الإصدار: ${document.issuedDate}
تاريخ الانتهاء: ${document.expiryDate}
جهة الإصدار: ${document.issuePlace || 'وزارة الداخلية - المديرية العامة للأحوال المدنية'}
------------------------------------------
ملاحظة: هذه الوثيقة إلكترونية وصالحة للاستخدام الرسمي.
يمكن التحقق من صحة الوثيقة عبر بوابة الخدمات الحكومية: www.egov.sy
------------------------------------------
        `;
        
        downloadTextAsFile(content, `وثيقة_${document.id}.txt`);
    }
}

// دالة لطباعة تفاصيل معاملة
function printTransaction(transactionId) {
    // في التطبيق الحقيقي، سيتم إنشاء نسخة للطباعة من المعاملة
    window.print();
}

// دالة لتحميل معاملة
function downloadTransaction(transactionId) {
    const transaction = userTransactions.find(trx => trx.id === transactionId);
    
    if (transaction) {
        // إنشاء محتوى النص للتحميل
        const content = `
بيانات المعاملة - بوابة الخدمات الحكومية السورية
------------------------------------------
نوع المعاملة: ${transaction.type}
رقم المعاملة: ${transaction.id}
تاريخ الطلب: ${transaction.date}
حالة المعاملة: ${transaction.status}
اسم المواطن: ${currentUser.name}
الرقم الوطني: ${currentUser.id}
الرسوم: ${transaction.fee || 'غير محدد'} ل.س
رقم المرجع: ${transaction.reference || 'غير محدد'}
مركز الخدمة: ${transaction.center || 'غير محدد'}
${transaction.status === 'مكتمل' ? `تاريخ الإنجاز: ${transaction.completionDate || 'غير محدد'}` : 
`التاريخ المتوقع للإنجاز: ${transaction.estimatedCompletion || 'غير محدد'}`}
${transaction.property ? `معلومات العقار: ${transaction.property}` : ''}
------------------------------------------
ملاحظة: هذه الوثيقة إلكترونية وصالحة للاستخدام الرسمي.
يمكن متابعة حالة المعاملة عبر بوابة الخدمات الحكومية: www.egov.sy
------------------------------------------
        `;
        
        downloadTextAsFile(content, `معاملة_${transaction.id}.txt`);
    }
}

// دالة مساعدة لتحميل نص كملف
function downloadTextAsFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

// بيانات افتراضية للعرض (يتم استخدامها لإظهار وظائف الموقع)
const demoUser = {
    id: "1234567890",
    name: "ياسر المفعلاني",
    address: "دمشق، حي المزة، شارع الفردوس",
    phone: "0991234567",
    email: "muhammad.ahmad@example.com",
    role: "admin", // منح المستخدم الافتراضي صلاحيات إدارية لعرض جميع الميزات
    documents: [
        { 
            id: "DOC-2023-001", 
            type: "بطاقة شخصية", 
            issuedDate: "2020-03-15", 
            expiryDate: "2030-03-14",
            issuePlace: "مديرية الشؤون المدنية - دمشق",
            nationalID: "1234567890"
        },
        { 
            id: "DOC-2023-002", 
            type: "جواز سفر", 
            issuedDate: "2021-07-20", 
            expiryDate: "2027-07-19",
            issuePlace: "إدارة الهجرة والجوازات - دمشق",
            passportNumber: "N0234567"
        },
        { 
            id: "DOC-2023-003", 
            type: "إخراج قيد", 
            issuedDate: "2022-01-10", 
            expiryDate: "2025-01-09",
            issuePlace: "دائرة النفوس - دمشق",
            regNumber: "R987654"
        },
        { 
            id: "DOC-2021-004", 
            type: "رخصة قيادة", 
            issuedDate: "2021-05-05", 
            expiryDate: "2023-05-04",
            issuePlace: "إدارة المرور - دمشق",
            licenseNumber: "DL123456",
            category: "فئة B"
        }
    ],
    transactions: [
        { 
            id: "TRX-2024-001", 
            type: "تجديد بطاقة شخصية", 
            date: "2024-01-15", 
            status: "مكتمل",
            center: "مركز الميدان للخدمات",
            fee: "5000",
            completionDate: "2024-01-20",
            reference: "REF123456"
        },
        { 
            id: "TRX-2024-002", 
            type: "إصدار جواز سفر", 
            date: "2024-02-10", 
            status: "قيد المعالجة",
            center: "مركز القابون للخدمات",
            fee: "15000",
            estimatedCompletion: "2024-02-25",
            reference: "REF234567"
        },
        { 
            id: "TRX-2023-003", 
            type: "طلب إخراج قيد", 
            date: "2023-11-05", 
            status: "مكتمل",
            center: "مركز المزة للخدمات",
            fee: "3000",
            completionDate: "2023-11-10",
            reference: "REF345678"
        },
        { 
            id: "TRX-2023-004", 
            type: "تسجيل عقاري", 
            date: "2023-09-18", 
            status: "مكتمل",
            center: "دائرة السجل العقاري - دمشق",
            fee: "7500",
            completionDate: "2023-10-05",
            reference: "REF456789",
            property: "عقار في منطقة المزة - رقم 456/12"
        },
        { 
            id: "TRX-2024-005", 
            type: "رخصة بناء", 
            date: "2024-01-30", 
            status: "قيد المعالجة",
            center: "البلدية - دمشق",
            fee: "12000",
            estimatedCompletion: "2024-03-15",
            reference: "REF567890",
            property: "قطعة أرض في منطقة يعفور - رقم 789/23"
        }
    ]
};