import * as cls from 'cls-hooked';

export class Logger {

    private readonly className: string;

    constructor(className: string) {
        this.className = className;
    }

    private getPrefix(): string {

        const namespace = cls.getNamespace('cl.gs.api');

        const rid = namespace.get('X-Request-ID') ?
            `[ ${namespace.get('X-Request-ID')} ] ` : '';

        return `${rid}[ ${this.className} ] `;
    }

    public log(message: string): void {
        console.log(this.getPrefix(), message);
    }

    public error(message: string, error: any = ''): void {
        console.error(this.getPrefix(), message, error);
    }
}
