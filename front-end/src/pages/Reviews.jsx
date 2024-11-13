import { TabContentContainer } from "../components/custom/ProfileComponents";
import ReviewsList from "../components/review/ReviewsList";
import useTitle from '../hooks/useTitle';

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