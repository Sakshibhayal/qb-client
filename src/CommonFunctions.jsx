export const showError = (message, onClose) => {
  return (
    <div 
      className="modal fade show"
      style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-danger">
          
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">Error</h5>
          </div>

          <div className="modal-body">
            <p className="fw-semibold text-dark">{message}</p>
          </div>

          <div className="modal-footer">
            <button className="btn btn-danger" onClick={onClose}>
              OK
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
