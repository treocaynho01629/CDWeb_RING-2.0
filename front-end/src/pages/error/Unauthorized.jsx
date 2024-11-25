import { useNavigate } from 'react-router'

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <section style={{display: 'flex', flexDirection: 'column', alignItems: 'center', height: '800px'}}>
            <br />
            <br />
            <img src="/empty.svg" style={{height: '250px', width: '250px'}}/>
            <h1>Bạn không có quyền truy cập vào trang này</h1>
            <p>Liên hệ ringbookstore@ring.com để biết thêm chi tiết.</p>
            <div className="flexGrow">
                <button style={{backgroundColor: '#63e399'}} onClick={goBack}>Trở về</button>
            </div>
        </section>
    )
}

export default Unauthorized