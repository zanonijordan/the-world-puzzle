- [x] Add `trustHost: true` to NextAuth config in `src/lib/auth.ts`
- [x] Verify Auth.js host trust error is resolved by restarting server and testing `/api/auth/session`

- [x] Fix admin dashboard access after admin login
- [x] Update NextAuth session strategy/token callbacks for middleware compatibility
- [ ] Validate critical path: login admin -> /admin -> /admin/posts
