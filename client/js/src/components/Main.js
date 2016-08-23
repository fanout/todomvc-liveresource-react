import React from "react";
import { connect } from "react-redux";

import LiveResourceInfo from "./LiveResourceInfo";
import Footer from "./Footer";
import * as fromRootReducer from "../reducers/index";

class Main extends React.PureComponent {
    render() {
        const { options, children } = this.props;
        const { endpointUrl } = options;

        return (
            <div>
                <LiveResourceInfo endpointUrl={endpointUrl} />
                {children}
                <Footer />
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        options: fromRootReducer.getOptionsState(state),
        children: ownProps.children
    };
}

export default connect(mapStateToProps)(Main);