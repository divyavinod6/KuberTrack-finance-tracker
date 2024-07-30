import React from 'react';
import './style.css';
import { Card, Row } from 'antd';
import Button from '../Button';
function Cards() {
  return (
    <div>
      <Row className="my-row">
        <Card className="my-card" title="Current Balance">
          <p>$0</p>
          <Button text="Reset Balance" blue={true} />
        </Card>
        <Card className="my-card" title="Current Balance">
          <p>$0</p>
          <Button text="Reset Balance" blue={true} />
        </Card>
        <Card className="my-card" title="Current Balance">
          <p>$0</p>
          <Button text="Reset Balance" blue={true} />
        </Card>
      </Row>
    </div>
  );
}

export default Cards;
