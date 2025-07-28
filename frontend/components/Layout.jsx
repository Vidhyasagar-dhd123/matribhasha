// +======================================================================+
// |                                                                      |
// |          #Layout.jsx to be implemented                               |
// |          Is exported in files :                                      |
// |                                                                      |
// |          This file imports                                           |
// |               ./NavBar.jsx                                           |
// |                                                                      |
// |          after changes put your update in this comment.              |
// |                                                                      |
// +======================================================================+

import Header from "./Header"
import Footer from "./Footer"

const Layout = (props) =>{
    return(
        <>
        <Header/>
            {props.children}
        <Footer/>
        </>
    )
}

export default Layout