import { Link } from "react-router-dom"

const Missing = () => {
    return (
        <article style={{ padding: "100px", 
        backgroundColor: '#63e399',
        display: 'flex', 
        justifyContent: 'center', 
        textAlign: 'center'}}>
            <div style={{color:' #e5fff0'}}>
                <h2>Có lỗi gì đó đã xảy ra!</h2>
                <h1 style={{fontSize: '250px', margin: 0, borderBottom: '10px solid'}}>404</h1>
                <h2>Không tìm thấy trang yêu cầu</h2>
                <img src="/empty.svg" style={{height: '150px'}}/>
                <div className="flexGrow" style={{marginTop: '10px', marginBottom: '100px', fontSize: '20px'}}>
                    <Link to="/">Về trang chủ</Link>
                </div>
            </div>
        </article>
    )
}

export default Missing