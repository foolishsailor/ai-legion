import ReactMarkdown from 'react-markdown';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Grid,
  useTheme
} from '@mui/material';

import { Message } from '../types/message';
import { capitalizeFirstLetter } from '../utils/strings';
import CommsIndicator from './commsIndicator';
import AgentsControlContext from '../pages/AgentsControl/AgentsControl.context';
import { useContext, useEffect, useRef } from 'react';

interface AgentProps {
  agentId: string;
}

const Agent = ({ agentId }: AgentProps) => {
  const theme = useTheme();
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  const {
    state: { messages, activeAgents, selectedAgent },
    dispatch
  } = useContext(AgentsControlContext);

  const handleSelectAgent = () => {
    dispatch({ field: 'selectedAgent', value: agentId });
  };

  const filteredMessages = messages.filter((message) =>
    message.targetAgentIds.includes(agentId)
  );

  const createTitle = (message: Message) => {
    const source =
      message.source.type === 'agent' && message.source.id === '0'
        ? 'Control'
        : `${capitalizeFirstLetter(message.source.type)} ${
            message.source.id || ''
          }`;

    return `${source} >>> ${message.targetAgentIds
      .map((id: string) => (id === '0' ? 'Control' : `Agent ${id}`))
      .join(', ')}`;
  };

  useEffect(() => {
    if (lastItemRef.current) {
      lastItemRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Grid
      onClick={handleSelectAgent}
      sx={{
        backgroundColor:
          agentId === selectedAgent
            ? theme.palette.primary.dark
            : theme.palette.grey[800],
        boxShadow:
          agentId === selectedAgent ? theme.shadows[7] : theme.shadows[2],
        borderRadius: 1,
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        p: 1,
        maxHeight:
          agentId === '0'
            ? '80vh'
            : `calc((100vh - 30px) / ${Math.ceil(
                (activeAgents.length - 1) / 3
              )})`
      }}
    >
      <Grid
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <Typography
          sx={{
            flex: 1,
            fontSize: 16,
            color: '#fff',
            fontWeight: 'bold',
            p: 1
          }}
        >
          {agentId === '0' ? 'Control' : `Agent ${agentId}`}
        </Typography>
        <CommsIndicator
          message={
            filteredMessages?.length > 0
              ? filteredMessages[filteredMessages.length - 1]
              : null
          }
        />
      </Grid>
      <List
        sx={{
          flex: 1,
          overflowX: 'auto',
          backgroundColor: '#1a1a1a',
          height: '100%'
        }}
      >
        {filteredMessages.map((message, idx) => (
          <ListItem
            key={idx}
            alignItems="flex-start"
            sx={{
              backgroundColor: message.type === 'error' ? '#300105' : '#222',
              borderRadius: 1,
              marginBottom: 1,
              p: 1,
              boxShadow: 1
            }}
          >
            <ListItemText
              primary={
                <Grid
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <Typography sx={{ flex: 1, fontSize: 14, color: '#fff' }}>
                    {createTitle(message)}
                  </Typography>
                  <Typography sx={{ fontSize: 14, color: '#fff' }}>
                    {`Type: ${message.type}`}
                  </Typography>
                </Grid>
              }
              secondary={<ReactMarkdown>{message.content}</ReactMarkdown>}
              secondaryTypographyProps={{
                fontSize: 14,
                color: '#ddd'
              }}
            />
          </ListItem>
        ))}
        <div ref={lastItemRef}></div>
      </List>
    </Grid>
  );
};

export default Agent;
