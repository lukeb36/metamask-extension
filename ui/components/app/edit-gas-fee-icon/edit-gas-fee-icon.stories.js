import React from 'react';
import EditGasFeeIcon from '.';

export default {
  title: 'Components/App/EditGasFeeIcon',
  argTypes: {
    userAcknowledgedGasMissing: {
      control: 'boolean',
    },
  },
  args: {
    userAcknowledgedGasMissing: true,
  },
};

export const DefaultStory = (args) => <EditGasFeeIcon {...args} />;

DefaultStory.storyName = 'Default';
