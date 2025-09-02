import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const faqs = [
  {
    question: "What is your return policy?",
    answer:
      "We offer a 7-day return window from the date of delivery. Items must be unused, in original packaging, and accompanied by the invoice.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery usually takes 2–5 business days depending on your location. You can track your order in the 'My Orders' section.",
  },
  {
    question: "Do you offer cash on delivery (COD)?",
    answer:
      "Yes, COD is available for most orders across India. However, a small COD handling fee may apply.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can reach us via email at support@yourstore.com or call our helpline at 1800-123-4567 (Mon–Sat, 9am–6pm).",
  },
];

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFaq = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="faq-container">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
          >
            <button
              onClick={() => toggleFaq(index)}
              className="faq-question"
            >
              <span>{faq.question}</span>
              {activeIndex === index ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            <div className="faq-answer-wrapper">
              <div className="faq-answer">{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .faq-container {
          max-width: 800px;
          margin: 60px auto;
          padding: 0 20px;
        }
        
        .faq-title {
          text-align: center;
          margin-bottom: 40px;
          font-size: 2.2rem;
          color: #2d3748;
          position: relative;
          padding-bottom: 15px;
        }
        
        .faq-title:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, #4299e1, #38b2ac);
          border-radius: 2px;
        }
        
        .faq-list {
          border-radius: 12px;
          overflow: hidden;
        }
        
        .faq-item {
          margin-bottom: 10px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }
        
        .faq-item:hover {
          box-shadow: 0 6px 16px rgba(0,0,0,0.1);
        }
        
        .faq-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 18px 24px;
          border: none;
          background: white;
          cursor: pointer;
          font-size: 1.1rem;
          font-weight: 600;
          color: #2d3748;
          text-align: left;
          transition: all 0.2s ease;
        }
        
        .faq-question:hover {
          color: #4299e1;
        }
        
        .faq-question svg {
          color: #718096;
          transition: transform 0.3s ease;
        }
        
        .faq-item.active .faq-question svg {
          transform: rotate(180deg);
          color: #4299e1;
        }
        
        .faq-answer-wrapper {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }
        
        .faq-item.active .faq-answer-wrapper {
          max-height: 200px;
        }
        
        .faq-answer {
          padding: 0 24px 20px;
          color: #4a5568;
          line-height: 1.6;
        }
        
        @media (max-width: 768px) {
          .faq-container {
            margin: 40px auto;
          }
          
          .faq-title {
            font-size: 1.8rem;
            margin-bottom: 30px;
          }
          
          .faq-question {
            padding: 16px 20px;
            font-size: 1rem;
          }
          
          .faq-answer {
            padding: 0 20px 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Faq;