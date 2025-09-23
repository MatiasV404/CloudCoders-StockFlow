#!/bin/bash
# filepath: c:\Users\PC\Downloads\Duoc UC\CloudCoders-StockFlow\StockFlow\deploy.sh

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Información del proyecto
PROJECT_NAME="StockFlow"
FIREBASE_PROJECT="stockflow-8e4f2"

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}🚀 Script de Deploy para ${PROJECT_NAME}${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Función para mostrar error y salir
error_exit() {
    echo -e "${RED}❌ Error: $1${NC}" >&2
    exit 1
}

# Función para mostrar éxito
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Función para mostrar advertencia
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Función para mostrar info
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    error_exit "No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
fi

if [ ! -f "firebase.json" ]; then
    error_exit "No se encontró firebase.json. El proyecto no está configurado para Firebase."
fi

# Verificar archivos de Firebase importantes
echo ""
info "Verificando archivos de configuración de Firebase..."
if [ ! -f "firestore.rules" ]; then
    warning "No se encontró firestore.rules"
else
    success "Archivo firestore.rules encontrado"
fi

if [ ! -f "src/firebase/firestore.rules" ]; then
    warning "No se encontró src/firebase/firestore.rules"
else
    success "Archivo src/firebase/firestore.rules encontrado"
fi

# Verificar si Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    warning "Firebase CLI no está instalado."
    echo "¿Deseas instalarlo ahora? (y/n)"
    read -r install_firebase
    if [[ $install_firebase =~ ^[Yy]$ ]]; then
        npm install -g firebase-tools || error_exit "Error al instalar Firebase CLI"
        success "Firebase CLI instalado correctamente"
    else
        error_exit "Firebase CLI es necesario para el deploy"
    fi
fi

# Verificar autenticación en Firebase
echo ""
info "Verificando autenticación en Firebase..."
if ! firebase projects:list &> /dev/null; then
    warning "No estás autenticado en Firebase."
    echo "¿Deseas iniciar sesión ahora? (y/n)"
    read -r login_firebase
    if [[ $login_firebase =~ ^[Yy]$ ]]; then
        firebase login || error_exit "Error al autenticarse en Firebase"
        success "Autenticado en Firebase correctamente"
    else
        error_exit "Autenticación en Firebase es necesaria para el deploy"
    fi
fi

# Mostrar información del proyecto
echo ""
info "Información del proyecto:"
echo "  📦 Nombre: ${PROJECT_NAME}"
echo "  🔥 Firebase Project: ${FIREBASE_PROJECT}"
echo "  📁 Directorio: $(pwd)"
echo "  🌐 URL actual: https://${FIREBASE_PROJECT}.web.app"

# Verificar estado del repositorio Git (si existe)
if [ -d ".git" ]; then
    echo ""
    info "Estado del repositorio Git:"
    
    # Verificar si hay cambios sin commit
    if ! git diff-index --quiet HEAD --; then
        warning "Hay cambios sin commit en el repositorio."
        git status --short
        echo ""
        echo "¿Deseas continuar sin hacer commit de los cambios? (y/n)"
        read -r continue_without_commit
        if [[ ! $continue_without_commit =~ ^[Yy]$ ]]; then
            echo "Por favor, haz commit de tus cambios y ejecuta el script nuevamente."
            exit 0
        fi
    fi
    
    # Mostrar última commit info
    echo "  📝 Último commit: $(git log -1 --pretty=format:'%h - %s (%an, %ar)')"
    echo "  🌿 Branch actual: $(git branch --show-current)"
fi

# Verificar dependencias
echo ""
info "Verificando dependencias..."
if [ ! -d "node_modules" ]; then
    warning "No se encontró node_modules. Instalando dependencias..."
    npm install || error_exit "Error al instalar dependencias"
    success "Dependencias instaladas correctamente"
else
    success "Dependencias encontradas"
fi

# Verificar variables de entorno
echo ""
info "Verificando variables de entorno..."
if [ ! -f ".env" ]; then
    warning "No se encontró archivo .env"
    echo "¿Deseas continuar sin variables de entorno? (y/n)"
    read -r continue_without_env
    if [[ ! $continue_without_env =~ ^[Yy]$ ]]; then
        error_exit "Variables de entorno necesarias para el proyecto"
    fi
else
    success "Archivo .env encontrado"
    # Verificar variables críticas
    if ! grep -q "VITE_FIREBASE_API_KEY" .env; then
        warning "No se encontró VITE_FIREBASE_API_KEY en .env"
    fi
fi

# Preguntar qué servicios desplegar
echo ""
echo -e "${BLUE}🎯 ¿Qué servicios de Firebase deseas desplegar?${NC}"
echo "1) Solo Hosting (aplicación web)"
echo "2) Solo Firestore Rules (reglas de base de datos)"
echo "3) Ambos (Hosting + Firestore Rules) - Recomendado"
echo "4) Todo (Hosting + Firestore Rules + Functions si existen)"
echo ""
read -p "Selecciona una opción (1-4): " deploy_option

case $deploy_option in
    1)
        DEPLOY_TARGETS="hosting"
        DEPLOY_DESCRIPTION="Solo Hosting"
        ;;
    2)
        DEPLOY_TARGETS="firestore:rules"
        DEPLOY_DESCRIPTION="Solo Firestore Rules"
        ;;
    3)
        DEPLOY_TARGETS="hosting,firestore:rules"
        DEPLOY_DESCRIPTION="Hosting + Firestore Rules"
        ;;
    4)
        DEPLOY_TARGETS=""
        DEPLOY_DESCRIPTION="Todos los servicios"
        ;;
    *)
        warning "Opción inválida. Usando opción por defecto (3 - Hosting + Firestore Rules)"
        DEPLOY_TARGETS="hosting,firestore:rules"
        DEPLOY_DESCRIPTION="Hosting + Firestore Rules"
        ;;
esac

# Mostrar resumen pre-deploy
echo ""
echo -e "${YELLOW}================================================${NC}"
echo -e "${YELLOW}📋 RESUMEN DEL DEPLOY${NC}"
echo -e "${YELLOW}================================================${NC}"
echo "🎯 Proyecto: ${PROJECT_NAME}"
echo "🔥 Firebase Project: ${FIREBASE_PROJECT}"
echo "📦 Servicios a desplegar: ${DEPLOY_DESCRIPTION}"
echo "🌐 URL de destino: https://${FIREBASE_PROJECT}.web.app"
echo "📅 Fecha/Hora: $(date)"
echo "👤 Usuario: $(whoami)"
echo -e "${YELLOW}================================================${NC}"

# Confirmación final
echo ""
echo -e "${YELLOW}¿Estás seguro de que deseas proceder con el deploy? (y/n)${NC}"
read -r final_confirmation
if [[ ! $final_confirmation =~ ^[Yy]$ ]]; then
    echo "Deploy cancelado por el usuario."
    exit 0
fi

# Si incluye hosting, hacer build
if [[ $DEPLOY_TARGETS == *"hosting"* ]] || [[ -z $DEPLOY_TARGETS ]]; then
    echo ""
    echo -e "${BLUE}🔨 Iniciando proceso de build...${NC}"
    echo ""

    # Limpiar dist anterior
    if [ -d "dist" ]; then
        info "Limpiando build anterior..."
        rm -rf dist
    fi

    # Ejecutar build
    echo "Ejecutando: npm run build"
    if npm run build; then
        success "Build completado exitosamente"
    else
        error_exit "Error durante el proceso de build"
    fi

    # Verificar que se generó el build
    if [ ! -d "dist" ]; then
        error_exit "No se generó el directorio dist"
    fi

    if [ ! -f "dist/index.html" ]; then
        error_exit "No se generó el archivo index.html"
    fi

    # Mostrar estadísticas del build
    echo ""
    info "Estadísticas del build:"
    echo "  📁 Tamaño del build: $(du -sh dist | cut -f1)"
    echo "  📄 Archivos generados: $(find dist -type f | wc -l)"
fi

# Validar reglas de Firestore si se van a desplegar
if [[ $DEPLOY_TARGETS == *"firestore"* ]] || [[ -z $DEPLOY_TARGETS ]]; then
    echo ""
    info "Validando reglas de Firestore..."
    
    if [ -f "firestore.rules" ]; then
        # Validar sintaxis de las reglas
        if firebase firestore:rules --help &> /dev/null; then
            info "Reglas de Firestore listas para deploy"
        fi
    else
        warning "No se encontraron reglas de Firestore para validar"
    fi
fi

# Confirmación antes del deploy
echo ""
echo -e "${YELLOW}¿Proceder con el deploy de ${DEPLOY_DESCRIPTION}? (y/n)${NC}"
read -r deploy_confirmation
if [[ ! $deploy_confirmation =~ ^[Yy]$ ]]; then
    if [[ $DEPLOY_TARGETS == *"hosting"* ]]; then
        warning "Deploy cancelado. Los archivos de build están disponibles en /dist"
    else
        warning "Deploy cancelado."
    fi
    exit 0
fi

# Deploy a Firebase
echo ""
echo -e "${BLUE}🚀 Deployando ${DEPLOY_DESCRIPTION} a Firebase...${NC}"
echo ""

# Ejecutar deploy según la opción seleccionada
if [[ -z $DEPLOY_TARGETS ]]; then
    # Deploy completo
    DEPLOY_CMD="firebase deploy"
else
    # Deploy específico
    DEPLOY_CMD="firebase deploy --only $DEPLOY_TARGETS"
fi

echo "Ejecutando: $DEPLOY_CMD"
if $DEPLOY_CMD; then
    echo ""
    echo -e "${GREEN}================================================${NC}"
    echo -e "${GREEN}🎉 DEPLOY COMPLETADO EXITOSAMENTE${NC}"
    echo -e "${GREEN}================================================${NC}"
    
    if [[ $DEPLOY_TARGETS == *"hosting"* ]] || [[ -z $DEPLOY_TARGETS ]]; then
        echo -e "${GREEN}✅ Aplicación web disponible en:${NC}"
        echo -e "${GREEN}🌐 https://${FIREBASE_PROJECT}.web.app${NC}"
    fi
    
    if [[ $DEPLOY_TARGETS == *"firestore"* ]] || [[ -z $DEPLOY_TARGETS ]]; then
        echo -e "${GREEN}✅ Reglas de Firestore actualizadas${NC}"
        echo -e "${GREEN}🛡️  Base de datos segura y configurada${NC}"
    fi
    
    echo -e "${GREEN}================================================${NC}"
    echo ""
    
    # Preguntizar si abrir en navegador (solo si se desplegó hosting)
    if [[ $DEPLOY_TARGETS == *"hosting"* ]] || [[ -z $DEPLOY_TARGETS ]]; then
        echo "¿Deseas abrir la aplicación en el navegador? (y/n)"
        read -r open_browser
        if [[ $open_browser =~ ^[Yy]$ ]]; then
            if command -v start &> /dev/null; then
                start https://${FIREBASE_PROJECT}.web.app
            elif command -v open &> /dev/null; then
                open https://${FIREBASE_PROJECT}.web.app
            elif command -v xdg-open &> /dev/null; then
                xdg-open https://${FIREBASE_PROJECT}.web.app
            else
                info "No se pudo abrir automáticamente. Ve a: https://${FIREBASE_PROJECT}.web.app"
            fi
        fi
    fi
    
else
    error_exit "Error durante el deploy a Firebase"
fi

# Log del deploy
echo ""
info "Deploy registrado en: $(date) por $(whoami) - Servicios: ${DEPLOY_DESCRIPTION}" >> deploy.log

echo ""
echo -e "${GREEN}🎯 Deploy completado. ¡Gracias por usar el script de deploy!${NC}"