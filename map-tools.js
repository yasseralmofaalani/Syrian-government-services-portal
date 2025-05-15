/**
 * Herramientas de mapa para la aplicación de servicios gubernamentales sirios
 * Este archivo contiene funciones auxiliares para la manipulación del mapa y sus elementos
 */

// Inicialización de herramientas para el mapa
function initializeMapTools(map) {
    // Agregar control de escala
    L.control.scale({
        imperial: false,
        position: 'bottomleft'
    }).addTo(map);
    
    // Configuración del control de localización
    const locateControl = L.control.locate({
        position: 'topleft',
        strings: {
            title: "تحديد موقعي",
            popup: "أنت على بعد {distance} {unit} من هذه النقطة",
            outsideMapBoundsMsg: "أنت خارج حدود الخريطة"
        },
        locateOptions: {
            enableHighAccuracy: true,
            maxZoom: 15
        }
    }).addTo(map);
    
    // Control de medición de distancia
    const measureControl = new L.Control.Measure({
        position: 'topleft',
        primaryLengthUnit: 'kilometers',
        secondaryLengthUnit: 'meters',
        primaryAreaUnit: 'sqkilometers',
        secondaryAreaUnit: 'sqmeters',
        activeColor: '#5cb85c',
        completedColor: '#0d6efd',
        localization: 'ar',
        measureControlTitle: 'قياس المسافة',
        captureZIndex: 10000
    });
    
    // Agregar herramientas adicionales mediante botones sencillos
    L.easyButton({
        states: [{
            stateName: 'print-map',
            icon: 'fa-print',
            title: 'طباعة الخريطة',
            onClick: function() {
                printMap(map);
            }
        }]
    }).addTo(map);
    
    return {
        locateControl,
        measureControl
    };
}

// Generar estilo personalizado para los contornos geográficos
function generateStyleForFeature(feature, options = {}) {
    const defaultOptions = {
        weight: 2,
        opacity: 0.7,
        color: '#096c45',
        dashArray: '',
        fillOpacity: 0.1,
        fillColor: '#096c45'
    };
    
    const style = { ...defaultOptions, ...options };
    
    return style;
}

// Agregar evento de hover a los elementos del mapa
function addHoverHandlers(layer, map) {
    layer.on({
        mouseover: function(e) {
            const layer = e.target;
            layer.setStyle({
                weight: 4,
                color: '#2c9c3e',
                dashArray: '',
                fillOpacity: 0.3
            });
            
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }
        },
        mouseout: function(e) {
            const layer = e.target;
            layer.setStyle({
                weight: 2,
                color: '#096c45',
                dashArray: '',
                fillOpacity: 0.1
            });
        }
    });
}

// Crear un marker personalizado para los servicios
function createServiceMarker(feature, map, onClick) {
    const { type, id, name } = feature.properties;
    const coords = feature.geometry.coordinates;
    
    // Determinar el color e icono según el tipo de servicio
    let markerColor, iconClass;
    
    switch(type) {
        case 'civil':
            markerColor = 'marker-civil';
            iconClass = 'fa-building';
            break;
        case 'hospital':
            markerColor = 'marker-hospital';
            iconClass = 'fa-hospital';
            break;
        case 'police':
            markerColor = 'marker-police';
            iconClass = 'fa-shield-alt';
            break;
        default:
            markerColor = 'marker-default';
            iconClass = 'fa-map-marker-alt';
    }
    
    // Crear elemento de icono personalizado
    const customIcon = L.divIcon({
        className: `custom-marker-icon ${markerColor}`,
        html: `<i class="fas ${iconClass}"></i>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
    });
    
    // Crear marker con el icono personalizado
    const marker = L.marker([coords[1], coords[0]], { 
        icon: customIcon,
        title: name 
    });
    
    // Agregar contenido del popup
    const popupContent = createPopupContent(feature.properties);
    marker.bindPopup(popupContent);
    
    // Agregar manejador de evento click personalizado si se proporciona
    if (onClick) {
        marker.on('click', () => onClick(feature));
    }
    
    return marker;
}

// Crear contenido del popup
function createPopupContent(properties) {
    const {
        id,
        name,
        services,
        status,
        workingHours,
        phone,
        address,
        rating,
        waitingTime,
        type
    } = properties;
    
    // Crear el título y contenido principal
    let popupContent = `
        <div class="custom-popup">
            <div class="popup-header">
                <h3>${name}</h3>
            </div>
            <div class="popup-content">
                <div class="popup-section">
                    <span class="popup-label">الحالة:</span>
                    <span>${status === 'open' ? 'مفتوح' : 'مغلق'}</span>
                </div>
                <div class="popup-section">
                    <span class="popup-label">ساعات العمل:</span>
                    <span>${workingHours}</span>
                </div>
                <div class="popup-section">
                    <span class="popup-label">متوسط وقت الانتظار:</span>
                    <span>${waitingTime}</span>
                </div>
                <div class="popup-section">
                    <span class="popup-label">التقييم:</span>
                    <span>${rating} / 5</span>
                </div>
                <div class="popup-section">
                    <span class="popup-label">العنوان:</span>
                    <span>${address}</span>
                </div>
                <div class="popup-section">
                    <span class="popup-label">رقم الهاتف:</span>
                    <span>${phone}</span>
                </div>
                
                <div class="popup-section">
                    <span class="popup-label">الخدمات المتاحة:</span>
                    <div class="popup-services">
                        ${services.map(service => `<span class="service-tag">${service}</span>`).join('')}
                    </div>
                </div>
            </div>
            
            <div class="popup-actions">
                <a class="popup-btn" onclick="showRegistrationForm(${id}, '${services[0]}')">
                    <i class="fas fa-calendar-check"></i> حجز موعد
                </a>
                <a class="popup-btn" onclick="getDirections(${id})">
                    <i class="fas fa-directions"></i> الاتجاهات
                </a>
            </div>
        </div>
    `;
    
    return popupContent;
}

// Crear mini mapa para confirmación
function createMiniMap(elementId, location, zoom = 14) {
    // Eliminar el mapa existente si hay uno
    if (window.miniMap) {
        window.miniMap.remove();
    }
    
    // Crear nuevo mapa
    const miniMap = L.map(elementId, {
        center: [location[0], location[1]],
        zoom: zoom,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false
    });
    
    // Agregar tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(miniMap);
    
    // Agregar marcador en la ubicación
    L.marker([location[0], location[1]]).addTo(miniMap);
    
    // Guardar referencia en la ventana
    window.miniMap = miniMap;
    
    return miniMap;
}

// Obtener la ubicación del usuario
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('متصفحك لا يدعم خدمة تحديد الموقع'));
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve([position.coords.latitude, position.coords.longitude]);
            },
            (error) => {
                let errorMessage;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'تم رفض طلب تحديد الموقع';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'معلومات الموقع غير متاحة';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'انتهت مهلة طلب تحديد الموقع';
                        break;
                    default:
                        errorMessage = 'حدث خطأ غير معروف';
                }
                reject(new Error(errorMessage));
            }
        );
    });
}

// Función para encontrar la ubicación por ID
function findLocationById(id, data) {
    // Búsqueda recursiva en los datos de todos los servicios
    const allData = [
        ...(data.civilCentersData?.features || []),
        ...(data.hospitalsData?.features || []),
        ...(data.policeStationsData?.features || [])
    ];
    
    const location = allData.find(feature => feature.properties.id === parseInt(id));
    
    if (location) {
        const { coordinates } = location.geometry;
        return {
            location: [coordinates[1], coordinates[0]],
            properties: location.properties
        };
    }
    
    return null;
}

// Mostrar análisis de servicio
function calculateServiceGaps(data) {
    // Análisis simulado de brechas de servicio
    return {
        title: "تحليل فجوات الخدمة",
        sections: [
            {
                title: "المناطق التي تفتقر للخدمات",
                content: [
                    "منطقة الحسكة: نقص في خدمات السجل المدني والمستشفيات",
                    "منطقة دير الزور: نقص في خدمات الرعاية الصحية المتخصصة",
                    "المناطق الريفية حول دمشق: كثافة منخفضة من مراكز الشرطة",
                    "ريف حمص: نقص في خدمات الأحوال المدنية"
                ],
                type: "list"
            },
            {
                title: "توصيات التحسين",
                content: [
                    "إنشاء 3 مراكز سجل مدني جديدة في الحسكة",
                    "افتتاح مركزين صحيين متخصصين في دير الزور",
                    "زيادة عدد دوريات الشرطة في المناطق الريفية حول دمشق",
                    "إنشاء فروع متنقلة للأحوال المدنية في ريف حمص"
                ],
                type: "list"
            }
        ]
    };
}

// Análisis de superposición de servicios
function calculateServiceOverlap(data) {
    return {
        title: "تحليل تداخل الخدمات",
        sections: [
            {
                title: "مناطق التركيز العالي للخدمات",
                content: [
                    "وسط دمشق: تركيز عالي من جميع أنواع الخدمات الحكومية",
                    "وسط حلب: تركيز كبير من المراكز الصحية ومراكز الشرطة",
                    "اللاذقية المدينة: تداخل خدمات السجل المدني والمستشفيات"
                ],
                type: "list"
            },
            {
                title: "فرص إعادة التوزيع",
                content: [
                    "نقل بعض مراكز الخدمة من وسط دمشق إلى الضواحي",
                    "دمج خدمات السجل المدني والخدمات الشرطية في مراكز مشتركة",
                    "إعادة توزيع الموارد من المناطق ذات التغطية العالية إلى المناطق المحرومة"
                ],
                type: "list"
            }
        ]
    };
}

// Análisis temporal de los servicios
function calculateTemporalAnalysis(data) {
    return {
        title: "تحليل وقت الانتظار والخدمة",
        sections: [
            {
                title: "أوقات الذروة",
                content: [
                    "السجل المدني: ذروة بين الساعة 9:00 و 11:00 صباحًا",
                    "المستشفيات: ذروة بين الساعة 10:00 صباحًا و 1:00 ظهرًا",
                    "مراكز الشرطة: ذروة بين الساعة 11:00 صباحًا و 2:00 ظهرًا"
                ],
                type: "list"
            },
            {
                title: "أوقات الانتظار حسب المنطقة",
                content: [
                    "دمشق: متوسط وقت الانتظار 45 دقيقة",
                    "حلب: متوسط وقت الانتظار 60 دقيقة",
                    "اللاذقية: متوسط وقت الانتظار 25 دقيقة",
                    "حمص: متوسط وقت الانتظار 30 دقيقة"
                ],
                type: "list"
            },
            {
                title: "توصيات لتقليل وقت الانتظار",
                content: [
                    "زيادة عدد الموظفين خلال ساعات الذروة",
                    "تطبيق نظام المواعيد المسبقة في جميع المراكز",
                    "تحسين إجراءات معالجة المعاملات لتقليل وقت الخدمة",
                    "توزيع الخدمات على مدار اليوم لتجنب التكدس"
                ],
                type: "list"
            }
        ]
    };
}

// Análisis de los proyectos gubernamentales
function calculateProjectAnalytics(projectsData) {
    // Calcular estadísticas generales
    const totalProjects = projectsData.length;
    const onTrackProjects = projectsData.filter(p => p.status === 'on_track').length;
    const delayedProjects = projectsData.filter(p => p.status === 'delayed').length;
    
    const totalBudget = projectsData.reduce((sum, p) => sum + p.budget.allocated, 0);
    const totalSpent = projectsData.reduce((sum, p) => sum + p.budget.spent, 0);
    const totalRemaining = projectsData.reduce((sum, p) => sum + p.budget.remaining, 0);
    
    const avgProgress = Math.round(projectsData.reduce((sum, p) => sum + p.progress, 0) / totalProjects);
    
    return {
        title: "تحليل المشاريع الحكومية",
        sections: [
            {
                title: "نظرة عامة على المشاريع",
                content: [
                    `إجمالي المشاريع: ${totalProjects}`,
                    `المشاريع في المسار الصحيح: ${onTrackProjects} (${Math.round(onTrackProjects/totalProjects*100)}%)`,
                    `المشاريع المتأخرة: ${delayedProjects} (${Math.round(delayedProjects/totalProjects*100)}%)`,
                    `متوسط نسبة الإنجاز: ${avgProgress}%`
                ],
                type: "list"
            },
            {
                title: "التحليل المالي",
                content: [
                    `الميزانية الإجمالية المخصصة: ${formatCurrency(totalBudget)}`,
                    `إجمالي المبالغ المصروفة: ${formatCurrency(totalSpent)} (${Math.round(totalSpent/totalBudget*100)}%)`,
                    `إجمالي المبالغ المتبقية: ${formatCurrency(totalRemaining)} (${Math.round(totalRemaining/totalBudget*100)}%)`
                ],
                type: "list"
            },
            {
                title: "المشاريع الرئيسية",
                content: projectsData.map(p => `${p.name}: ${p.progress}% مكتمل - ${p.status === 'on_track' ? 'في المسار الصحيح' : 'متأخر'}`),
                type: "list"
            }
        ]
    };
}

// Formatear moneda
function formatCurrency(amount) {
    return new Intl.NumberFormat('ar-SY', {
        style: 'currency',
        currency: 'SYP',
        maximumFractionDigits: 0
    }).format(amount);
}

// Función para imprimir mapa
function printMap(map) {
    // Crear un elemento separado para la impresión
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('يرجى السماح بالنوافذ المنبثقة لطباعة الخريطة');
        return;
    }
    
    // HTML para la ventana de impresión
    printWindow.document.write(`
        <html>
        <head>
            <title>خريطة الخدمات الحكومية السورية</title>
            <style>
                body { font-family: 'Tajawal', Arial, sans-serif; direction: rtl; }
                .header { text-align: center; margin-bottom: 20px; }
                .map-container { width: 100%; height: 650px; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>خريطة الخدمات الحكومية السورية</h1>
                <p>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-SY')}</p>
            </div>
            <div id="map-print" class="map-container"></div>
            <div class="footer">
                <p>© بوابة الخدمات الحكومية السورية - جميع الحقوق محفوظة</p>
            </div>
            <script>
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                        window.close();
                    }, 1000);
                };
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

// Exportar funciones
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeMapTools,
        generateStyleForFeature,
        addHoverHandlers,
        createServiceMarker,
        createPopupContent,
        createMiniMap,
        getUserLocation,
        findLocationById,
        calculateServiceGaps,
        calculateServiceOverlap,
        calculateTemporalAnalysis,
        calculateProjectAnalytics,
        printMap
    };
}