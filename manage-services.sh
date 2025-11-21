#!/bin/bash

case "$1" in
    start)
        docker-compose up -d
        ;;
    stop)
        docker-compose down
        ;;
    restart)
        docker-compose restart
        ;;
    status)
        docker-compose ps
        ;;
    logs)
        docker-compose logs -f
        ;;
    monitor)
        watch -n 5 'docker-compose ps && echo "" && curl -s http://localhost:8102/health | head -20'
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs|monitor}"
        exit 1
        ;;
esac
