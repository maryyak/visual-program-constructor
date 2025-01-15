import {useState} from "react";

const usePagination = (data, itemsPerPage) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsForPage, setItemsForPage] = useState(25);

    const totalCount = data.length;
    const totalPages = Math.ceil(totalCount / itemsForPage);

    const currentElements = data.slice(
        (currentPage - 1) * itemsForPage,
        currentPage * itemsForPage
    );

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsForPageChange = (itemsCount) => {
        setItemsForPage(itemsCount);
        setCurrentPage(1);
    };

    return {
        currentElements,
        totalCount,
        itemsForPage,
        currentPage,
        totalPages,
        handleItemsForPageChange,
        handlePageChange
    };
};

export default usePagination;
