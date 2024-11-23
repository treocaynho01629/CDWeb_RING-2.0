import { Dialog } from "@mui/material";
import { TabContentContainer } from "../components/custom/ProfileComponents";
import { useNavigate, useOutletContext } from "react-router-dom";
import ReviewsList from "../components/review/ReviewsList";
import useTitle from '../hooks/useTitle';

const Orders = () => {
    const { tabletMode, mobileMode } = useOutletContext();
    const navigate = useNavigate();

    //Set title
    useTitle('Đánh giá');

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
                    <ReviewsList mobileMode={mobileMode}/>
                </Dialog>
                :
                <TabContentContainer>
                    <ReviewsList mobileMode={mobileMode}/>
                </TabContentContainer>
            }
        </div >
    )
}

export default Orders  