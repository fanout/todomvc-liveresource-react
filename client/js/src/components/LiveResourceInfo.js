import React from "react";

class LiveResourceInfo extends React.PureComponent {
    render() {
        const { endpointUrl } = this.props;

        const codeClassName = "ba b--gray br0_25 bg-ghostwhite ph0_5 pv0_25";

        return (
            <div className="f4 mh--5 tc">
                <p>API docs: <a href="http://docs.realtimetodolist.apiary.io/">http://docs.realtimetodolist.apiary.io/</a></p>
                {endpointUrl != null ? (
                    <p>
                        Stream: <code className={codeClassName}>curl -i {endpointUrl}?stream=true</code>
                    </p>
                ) : null}
            </div>
        );
    }
}

export default LiveResourceInfo;
