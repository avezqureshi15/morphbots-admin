import { ReactNode } from 'react';
import Sidebar from '../components/general/sidebar/Sidebar';
import styled from 'styled-components';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <Container>
            <Sidebar />
            <Main>
                {children}
            </Main>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    height: 100vh;
`;

const Main = styled.main`
    border-radius: 0;
    height: 100%;
    width: calc(100% - 352px);
    position: absolute;
    right: 0;
    top: 0;
    transition: width 0.3s ease;

    @media (max-width: 1024px) {
        width: 71%;
    }
`;

export default Layout;
