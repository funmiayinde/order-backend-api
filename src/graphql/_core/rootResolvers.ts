import { GraphQLScalarType, Kind } from 'graphql';
import moment from 'moment';

export default {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.toISOString();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10);
      }
      return null;
    },
  }),
  UTCMoment: new GraphQLScalarType({
    name: 'UTCMoment',
    description: 'UTCMoment custom scalar type',
    parseValue(value) {
      return moment.utc(value);
    },
    serialize(value) {
      return value.toISOString();;
    },
    parseLiteral(ast) {
      return moment.utc(ast as unknown);
    },
  }),
};
