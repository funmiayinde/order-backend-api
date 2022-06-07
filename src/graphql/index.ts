// TYPES
import rootTypes from './_core/types';
import orderTypes from './order/types';

// RESOLVES
import rootResolvers from './_core/rootResolvers';
import orderResolver from './order/resolvers';

export const types = [rootTypes, orderTypes];

export const resolvers = [rootResolvers, orderResolver];
