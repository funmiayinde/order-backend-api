import { fromUnixTime } from 'date-fns';
import { GraphQLScalarType, Kind } from 'graphql';

export default {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return fromUnixTime(value);
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
      return new Date(value);
    },
    serialize(value) {
      return fromUnixTime(value);
    },
    parseLiteral(ast) {
      return ast;
    },
  }),
};
