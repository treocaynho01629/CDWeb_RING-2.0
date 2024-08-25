import { TablePagination } from "@mui/material";
import { useEffect, useState } from "react";

const CustomTablePagination = (props) => {
    const { pagination, count, onPageChange, onSizeChange } = props;
    //Initial value
    const [page, setPage] = useState(pagination?.currPage ?? 0);
    const [size, setSize] = useState(pagination?.pageSize ?? 10);

    //Update value
    useEffect(() => {
        setPage(pagination?.currPage);
        setSize(pagination?.pageSize);
    }, [pagination])

    //Change current page 
    const handlePageChange = (e, page) => { if (onPageChange) onPageChange(page); }

    //Change amount display
    const handleChangeSize = (e) => { if (onSizeChange) onSizeChange(e.target.value) }

    return (
        <TablePagination
            {...props}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            labelRowsPerPage={"Hiển thị"}
            labelDisplayedRows={
                function defaultLabelDisplayedRows(
                    { from, to, count }) {
                    return `${from}–${to} trong số ${count !== -1
                        ? count
                        : `Có hơn ${to}`}`;
                }}
            page={page}
            rowsPerPage={size}
            showFirstButton
            showLastButton
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleChangeSize}
        />
    )
}

export default CustomTablePagination