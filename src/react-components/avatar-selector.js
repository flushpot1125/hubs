import React, { Component } from "react";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";

import MediaBrowser from "./media-browser";
import AvatarPreview from "./avatar-preview";
import styles from "../assets/stylesheets/avatar-selector.scss";
import { getAvatarGltfUrl } from "../assets/avatars/avatars";

class AvatarSelector extends Component {
  static propTypes = {
    history: PropTypes.object,
    avatarId: PropTypes.string,
    onChange: PropTypes.func
  };

  state = { previewAvatarGltfUrl: null, showPreview: true };

  constructor(props) {
    super(props);
    this.mediaSearchStore = window.APP.mediaSearchStore;
    this.mediaSearchStore.loadSource("avatars");
    this.widthQuery = window.matchMedia("(min-width: 1200px)");
  }

  componentDidMount = async () => {
    this.setState({ previewAvatarGltfUrl: await getAvatarGltfUrl(this.props.avatarId) });
    this.widthQuery.addListener(this.togglePreview);
  };

  componentWillUnmount = () => {
    this.widthQuery.removeListener(this.togglePreview);
  };

  togglePreview = query => {
    this.setState({ showPreview: query.matches });
  };

  avatarSelected = async entry => {
    this.props.onChange(entry.id);
    this.setState({ previewAvatarGltfUrl: entry.url });
  };

  render() {
    return (
      <div className={styles.avatarSelectorContainer}>
        <MediaBrowser
          {...this.props}
          showHeader={false}
          closeOnSelect={false}
          ignoreHistory={true}
          highlightSelected={true}
          mediaSearchStore={this.mediaSearchStore}
          onMediaSearchResultEntrySelected={this.avatarSelected}
          selectedEntryId={this.props.avatarId}
        />
        {this.state.showPreview && <AvatarPreview avatarGltfUrl={this.state.previewAvatarGltfUrl} />}
      </div>
    );
  }
}

export default injectIntl(AvatarSelector);
