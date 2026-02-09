#!/bin/bash

# Al-Houda Mosque - Deployment Script
# For deploying to production servers

set -e

echo "🕌 Al-Houda Mosque - Deployment Script"
echo "======================================"

# Configuration
APP_NAME="alhouda-mosque"
DOCKER_IMAGE="alhouda-mosque:latest"
DOCKER_CONTAINER="alhouda-mosque-app"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    log_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Parse arguments
COMMAND=${1:-"help"}

case $COMMAND in
    build)
        log_info "Building Docker image..."
        docker build -t "$DOCKER_IMAGE" .
        log_info "Build completed successfully!"
        ;;

    deploy)
        log_info "Deploying to production..."

        # Stop existing container
        if [ "$(docker ps -q -f name=$DOCKER_CONTAINER)" ]; then
            log_info "Stopping existing container..."
            docker stop "$DOCKER_CONTAINER"
            docker rm "$DOCKER_CONTAINER"
        fi

        # Build new image
        log_info "Building new image..."
        docker build -t "$DOCKER_IMAGE" .

        # Start new container
        log_info "Starting new container..."
        docker run -d \
            --name "$DOCKER_CONTAINER" \
            --restart unless-stopped \
            -p 3000:3000 \
            -e NODE_ENV=production \
            -e NEXT_TELEMETRY_DISABLED=1 \
            "$DOCKER_IMAGE"

        log_info "Deployment completed successfully!"
        log_info "Application is running at http://localhost:3000"
        ;;

    compose)
        log_info "Starting with Docker Compose..."
        docker-compose up -d
        log_info "Deployment completed successfully!"
        ;;

    compose-dev)
        log_info "Starting development environment with Docker Compose..."
        docker-compose --profile dev up -d
        log_info "Development environment started!"
        ;;

    stop)
        log_info "Stopping containers..."
        docker-compose down
        log_info "Containers stopped!"
        ;;

    restart)
        log_info "Restarting containers..."
        docker-compose restart
        log_info "Containers restarted!"
        ;;

    logs)
        log_info "Showing logs..."
        docker-compose logs -f
        ;;

    backup)
        log_info "Creating backup..."
        BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.tar.gz"
        tar -czf "$BACKUP_FILE" \
            --exclude='node_modules' \
            --exclude='.next' \
            --exclude='.git' \
            .
        log_info "Backup created: $BACKUP_FILE"
        ;;

    clean)
        log_warn "Cleaning up Docker resources..."
        docker system prune -f
        log_info "Cleanup completed!"
        ;;

    health)
        log_info "Checking application health..."
        if curl -sf http://localhost:3000 > /dev/null; then
            log_info "Application is healthy! ✓"
        else
            log_error "Application is not responding!"
            exit 1
        fi
        ;;

    help|*)
        echo "Usage: ./deploy.sh [command]"
        echo ""
        echo "Commands:"
        echo "  build        - Build Docker image"
        echo "  deploy       - Deploy to production"
        echo "  compose      - Start with Docker Compose"
        echo "  compose-dev  - Start development environment"
        echo "  stop         - Stop all containers"
        echo "  restart      - Restart all containers"
        echo "  logs         - Show application logs"
        echo "  backup       - Create backup of project files"
        echo "  clean        - Clean up Docker resources"
        echo "  health       - Check application health"
        echo "  help         - Show this help message"
        echo ""
        echo "Examples:"
        echo "  ./deploy.sh build          # Build the Docker image"
        echo "  ./deploy.sh deploy         # Deploy to production"
        echo "  ./deploy.sh compose        # Start with Docker Compose"
        ;;
esac
