import useTitle from '../hooks/useTitle';
import OrdersList from "../components/order/OrdersList";
import { Dialog } from "@mui/material";
import { useNavigate, useOutletContext } from 'react-router';
import { TabContentContainer } from "../components/custom/ProfileComponents";

const Orders = () => {
    const { tabletMode, mobileMode } = useOutletContext();
    const navigate = useNavigate();

    //Set title
    useTitle('Đơn hàng');

    return (
        <div>
            {tabletMode ?
                <Dialog
                    open={tabletMode}
                    onClose={() => navigate('/profile/detail')}
                    fullScreen={mobileMode}
                    scroll={'paper'}
                    maxWidth={'md'}
                    fullWidth
                    PaperProps={{ elevation: 0 }}
                >
                    <OrdersList />
                </Dialog>
                :
                <TabContentContainer>
                    <OrdersList />
                </TabContentContainer>
            }
        </div >
    )
}

export default Orders  