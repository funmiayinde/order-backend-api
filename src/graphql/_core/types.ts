export default `
    schema {
        query: Query
        mutation: Mutation
    }
    type Query
    type Mutation

    type Pagination {
        total_count: Int
        per_page: Int
        previous: Int
        current: Int
        next: Int
    }

    input FilterInput{
        field: String!
        condition: String!
        value: String!
    }

    input PaginationInput {
        page: Int
        per_page: Int
    }

    scalar Date
    scalar UTCMoment
`;