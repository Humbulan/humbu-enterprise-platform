const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class GitManager {
    constructor() {
        this.repoPath = process.cwd();
        this.deployments = [];
    }

    async getStatus() {
        return new Promise((resolve, reject) => {
            exec('git status --porcelain', { cwd: this.repoPath }, (error, stdout) => {
                if (error) {
                    reject(error);
                    return;
                }
                
                const changes = stdout.trim().split('\n').filter(line => line);
                resolve({
                    hasChanges: changes.length > 0,
                    changes: changes.map(change => {
                        const [status, file] = change.split(' ');
                        return { status: status.trim(), file: file.trim() };
                    })
                });
            });
        });
    }

    async getCommits(limit = 10) {
        return new Promise((resolve, reject) => {
            exec(`git log --oneline -n ${limit}`, { cwd: this.repoPath }, (error, stdout) => {
                if (error) {
                    reject(error);
                    return;
                }
                
                const commits = stdout.trim().split('\n').map(line => {
                    const [hash, ...message] = line.split(' ');
                    return {
                        hash: hash,
                        message: message.join(' '),
                        shortHash: hash.substring(0, 7)
                    };
                });
                
                resolve(commits);
            });
        });
    }

    async createDeployment(commitHash, environment = 'staging', deployedBy = 'system') {
        const deployment = {
            id: `dep_${Date.now()}`,
            commitHash,
            environment,
            deployedBy,
            timestamp: new Date().toISOString(),
            status: 'in_progress'
        };

        this.deployments.unshift(deployment);
        
        // Simulate deployment process
        setTimeout(() => {
            deployment.status = 'success';
            deployment.completedAt = new Date().toISOString();
            console.log(`✅ Deployment ${deployment.id} completed successfully`);
        }, 2000);

        return deployment;
    }

    async rollbackDeployment(deploymentId, targetCommit) {
        const deployment = this.deployments.find(dep => dep.id === deploymentId);
        if (!deployment) {
            throw new Error(`Deployment ${deploymentId} not found`);
        }

        const rollback = {
            id: `rollback_${Date.now()}`,
            originalDeployment: deploymentId,
            targetCommit: targetCommit || deployment.commitHash,
            rolledBackBy: 'system',
            timestamp: new Date().toISOString(),
            status: 'in_progress'
        };

        this.deployments.unshift(rollback);

        // Simulate rollback process
        setTimeout(() => {
            rollback.status = 'success';
            rollback.completedAt = new Date().toISOString();
            console.log(`🔄 Rollback ${rollback.id} completed to commit ${targetCommit}`);
        }, 2000);

        return rollback;
    }

    async getDeploymentHistory(limit = 20) {
        return this.deployments.slice(0, limit);
    }

    async getTeamActivity(days = 7) {
        // Mock team activity data
        return [
            { user: 'admin', action: 'deployment', timestamp: new Date().toISOString(), environment: 'production' },
            { user: 'dev1', action: 'commit', timestamp: new Date(Date.now() - 3600000).toISOString(), message: 'Fix authentication bug' },
            { user: 'dev2', action: 'rollback', timestamp: new Date(Date.now() - 7200000).toISOString(), deployment: 'dep_123' },
            { user: 'admin', action: 'config_update', timestamp: new Date(Date.now() - 86400000).toISOString(), service: 'api-gateway' }
        ];
    }

    async getConfigurations() {
        const configFiles = [
            {
                name: 'api-gateway.config.js',
                path: '/docker-deployment/api-gateway',
                lastModified: new Date().toISOString(),
                environment: 'all',
                version: '1.2.0'
            },
            {
                name: 'database.config.js', 
                path: '/libs/sqlite',
                lastModified: new Date(Date.now() - 86400000).toISOString(),
                environment: 'production',
                version: '1.1.0'
            },
            {
                name: 'security.config.js',
                path: '/docker-deployment/api-gateway/security',
                lastModified: new Date(Date.now() - 172800000).toISOString(),
                environment: 'staging',
                version: '1.0.1'
            }
        ];

        return configFiles;
    }
}

module.exports = new GitManager();
