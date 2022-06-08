export default `
    extend type Query {
        getOrder(uid: String!): Order
        getOrders(query: OrderQueryInput!): Orders
        deleteOrder(uid: String!): DeleteOrder
    }

    extend type Mutation {
        createOrder(createOrderInput: CreateOrderInput!): Order
        updateOrder(updateOrderInput: UpdateOrderInput!, uid: String!): Order
    }

    input CreateOrderInput {
        title: String!
        uid: String
        address: AddressInput!
        bookingDate: Date!
        customer: CustomerInput!
    }
    
    input UpdateOrderInput {
        title: String
        uid: String
        address: AddressInput
        bookingDate: Date
        customer: CustomerInput
    }

    input AddressInput {
        zip: String!
        street: String!
        city: String!
        country: String!
    }
    
    input CustomerInput {
        email: String!
        name: String!
        phone: String!
    }

    type Order {
        uid: String
        title: String
        address: Address
        bookingDate: String
        customer: Customer
    }

    type Orders {
        pagination: Pagination
        data: [Order]
    }

    type Address {
        zip: String
        street: String
        city: String
        country: String
    }

    type Customer {
        email: String
        name: String
        phone: String
    }

    input OrderQueryInput {
        pagination: PaginationInput
        filters: [FilterInput]
    }

    type DeleteOrder {
        uid: String
    }
`;
