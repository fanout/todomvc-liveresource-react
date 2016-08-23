import React from "react";

class LiveResourceInfo extends React.PureComponent {
    render() {
        const { endpointUrl } = this.props;

        return (
            <div className="f4">
                <p>API docs: <a href="http://docs.realtimetodolist.apiary.io/">http://docs.realtimetodolist.apiary.io/</a></p>
                {endpointUrl != null ? (
                    <p>
                        Stream: <code className="example-code">curl -i <span className="endpoint">{endpointUrl}</span>?stream=true</code>
                    </p>
                ) : null}
            </div>
        );
    }
}

export default LiveResourceInfo;
