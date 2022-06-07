import { createResolver } from 'apollo-resolvers';

export const baseResolver = createResolver(
    // incoming request will pass through this resolver
    null,
);