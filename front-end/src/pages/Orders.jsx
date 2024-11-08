import { TabContentContainer } from "../components/custom/GlobalComponents";
import styled from "styled-components"
import useTitle from '../hooks/useTitle';
import CustomPlaceholder from "../components/custom/CustomPlaceholder";
import OrdersList from "../components/profile/OrdersList";

//#region styled
const Wrapper = styled.div`
`

const PlaceholderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40dvh;
`
//#endregion

const tempLoad = ( <PlaceholderContainer><CustomPlaceholder /></PlaceholderContainer>)

const Orders = () => {
    //Set title
    useTitle('Đơn hàng');
    //FIX

    return (
        <Wrapper>
            <TabContentContainer>
                <OrdersList />
            </TabContentContainer>
        </Wrapper >
    )
}

export default Orders  