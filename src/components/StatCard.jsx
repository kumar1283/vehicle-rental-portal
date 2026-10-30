function StatCard(props) {
  return (
    <div className="stat-card" style={{ borderTopColor: props.color }}>
      <p>{props.title}</p>
      <h3>{props.value}</h3>
    </div>
  );
}

export default StatCard;
