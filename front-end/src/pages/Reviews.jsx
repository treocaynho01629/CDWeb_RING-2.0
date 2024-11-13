import { TabContentContainer } from "../components/custom/ProfileComponents";
import useTitle from '../hooks/useTitle';
import ReviewsList from "../components/profile/ReviewsList";

const Orders = () => {
    //Set title
    useTitle('Đánh giá');
    //FIX

    return (
        <div>
            <TabContentContainer>
                <ReviewsList />
            </TabContentContainer>
        </div >
    )
}

export default Orders  