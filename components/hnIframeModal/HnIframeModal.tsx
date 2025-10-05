import "./hnIframeModal.css";
import { XCircle } from "phosphor-react";

type HnIframeModalProps = {
  url: string | null;
  onClearUrl: () => void;
};
const HnIframeModal = ({ url, onClearUrl }: HnIframeModalProps) => {
  let modalContainerClass = `modal-container ${url && "fadeInClass"}`;
  if (!url) return;
  return (
    <div className={modalContainerClass}>
      <div className="hn-iframe-modal-conatainer">
        <div className="hn-iframe-modal">
          <span className="close-hn-iframe-modal-icon" onClick={onClearUrl}>
            <XCircle size={100} className="xcircle" />
          </span>
          <iframe src={url}></iframe>
        </div>
      </div>
    </div>
  );
};

export default HnIframeModal;
