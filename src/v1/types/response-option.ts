import Pagination from '../../lib/pagination';
import QueryParser from '../../lib/query-parser';

type ResponseOption = {
    token?: string;

    /** value data to be returned to the client */
    value: unknown | never;

    /** the status code */
    code: number;

    /** the response message  */
    message?: string;

    /*** the queryparser util for the query */
    queryParser?: QueryParser;

    /** the pagination used   */
    pagination?: Pagination;

    count?: number;
};
export default ResponseOption;
