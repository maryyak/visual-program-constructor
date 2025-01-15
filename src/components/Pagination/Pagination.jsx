import React from 'react';
import styles from "./Pagination.module.scss";
import clsx from "clsx";

const Pagination = ({totalCount, itemsForPage= 25, currentPage, totalPages, handleItemsForPageChange, handlePageChange}) => {

    return (
        <div className={styles.pagination}>
            <div>Всего: <span className={styles.highlighted}>{totalCount}</span></div>
            <div className={styles.rowContainer}>Показать:
                <span onClick={() => handleItemsForPageChange(25)}
                      className={clsx({[styles.highlighted]: itemsForPage === 25}, styles.showVariant)}>25</span>
                <span onClick={() => handleItemsForPageChange(50)}
                      className={clsx({[styles.highlighted]: itemsForPage === 50}, styles.showVariant)}>50</span>
                <span onClick={() => handleItemsForPageChange(totalCount)}
                      className={clsx({[styles.highlighted]: itemsForPage === totalCount}, styles.showVariant)}>Все</span>
            </div>
            <div className={styles.rowContainer}>
                <span>{(currentPage - 1) * itemsForPage + 1}–{currentPage * itemsForPage > totalCount ? totalCount : currentPage * itemsForPage} из {totalCount}</span>
                <div className={styles.buttons}>
                    <div className={styles.button} onClick={() => handlePageChange(currentPage === 1 ? currentPage : currentPage - 1)}>
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.3462 7.5L9.34619 12.5L14.3462 17.5L14.3462 7.5Z" fill="#666666"
                                  fillOpacity={currentPage === 1 ? "0.26" : "0.87"}/>
                        </svg>
                    </div>
                    <div className={styles.button} onClick={() => handlePageChange(currentPage === totalPages ? currentPage : currentPage + 1)}>
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.3462 17.5L15.3462 12.5L10.3462 7.5L10.3462 17.5Z" fill="#666666"
                                  fillOpacity={currentPage === totalPages ? "0.26" : "0.87"}/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pagination;