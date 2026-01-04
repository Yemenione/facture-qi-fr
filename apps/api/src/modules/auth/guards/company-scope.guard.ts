import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class CompanyScopeGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (user.role !== 'SUPER_ADMIN' && !user.companyId) {
            throw new ForbiddenException("Utilisateur non rattaché à une entreprise");
        }

        return true;
    }
}
