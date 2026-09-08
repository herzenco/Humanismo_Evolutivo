"use client";


import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

const ChatInterface = () => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const copy = language === 'es'
    ? {
        greeting: 'Hola, soy Marcos Constandse Madrazo. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre mis libros, mi filosofía, o cualquier tema relacionado con la consciencia, la espiritualidad o la ecología.',
        conversation: 'Conversación Filosófica',
        introTitle: 'Bienvenido al Diálogo Filosófico',
        closeIntro: 'Cerrar introducción',
        introBody: 'Esta experiencia te permite interactuar con una simulación del pensamiento de Marcos Constandse Madrazo.',
        introHelp: 'Puedes escribir o usar el micrófono para preguntar sobre sus libros, filosofía, o temas relacionados con consciencia, espiritualidad y ecología.',
        placeholder: 'Escribe un mensaje...',
        startRecording: 'Iniciar grabación',
        stopRecording: 'Detener grabación',
        send: 'Enviar mensaje',
      }
    : {
        greeting: 'Hello, I am Marcos Constandse Madrazo. How can I help you today? You can ask me about my books, my philosophy, or any subject related to consciousness, spirituality, or ecology.',
        conversation: 'Philosophical Conversation',
        introTitle: 'Welcome to the Philosophical Dialogue',
        closeIntro: 'Close introduction',
        introBody: 'This experience lets you interact with a simulation of Marcos Constandse Madrazo’s thought.',
        introHelp: 'You can type or use the microphone to ask about his books, philosophy, or subjects related to consciousness, spirituality, and ecology.',
        placeholder: 'Write a message...',
        startRecording: 'Start recording',
        stopRecording: 'Stop recording',
        send: 'Send message',
      };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    // Add welcome message after a short delay to simulate bot thinking
    const timer = setTimeout(() => {
      setMessages([
        {
          id: '1',
          text: copy.greeting,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, [copy.greeting]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    (window as any).dataLayer?.push({
      event: 'chatbot_message_sent',
      message_length: inputValue.length,
      message_preview: inputValue.substring(0, 50)
    });
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate bot response based on user input
      let botResponse = '';
      
      const userText = inputValue.toLowerCase();
      
      if (userText.includes('humanismo') || userText.includes('humanism') || userText.includes('evolutivo') || userText.includes('evolutionary') || userText.includes('transpersonal')) {
        botResponse = language === 'es'
          ? 'El Humanismo Evolutivo Transpersonal plantea una visión transpersonal del ser humano, donde cada individuo no es un ente aislado sino una expresión de la totalidad interconectada. La consciencia transpersonal nos permite trascender los límites del ego y experimentar la unidad con los demás y con la naturaleza. "Yo soy nosotros" expresa esta visión fundamental.'
          : 'Transpersonal Evolutionary Humanism offers a transpersonal view of the human being, in which each person is not an isolated entity but an expression of an interconnected whole. Transpersonal consciousness lets us move beyond the limits of ego and experience unity with others and with nature. “I am us” expresses this foundational vision.';
      } else if ((userText.includes('mejor') && userText.includes('venir')) || (userText.includes('best') && userText.includes('come'))) {
        botResponse = language === 'es'
          ? '"Y lo mejor aún está por venir" es una invitación a entender la evolución no como un destino sino como una elección. Cada uno de nosotros tiene el poder de decidir su camino hacia la felicidad y la plenitud, tomando las riendas de su propio desarrollo consciente.'
          : '“The Best Is Yet to Come” invites us to understand evolution not as a destination but as a choice. Each of us can choose a path toward happiness and fulfillment by taking responsibility for our conscious development.';
      } else if (userText.includes('empresario') || userText.includes('empresa') || userText.includes('entrepreneur') || userText.includes('business')) {
        botResponse = language === 'es'
          ? 'El arte de ser empresario va mucho más allá de generar ganancias. Es una vocación de servicio donde la ética, la sostenibilidad y el bien común deben ser prioritarios. El verdadero empresario es un agente de cambio positivo en la sociedad.'
          : 'The art of being an entrepreneur goes far beyond generating profit. It is a vocation of service in which ethics, sustainability, and the common good must be priorities. A true entrepreneur is an agent of positive change in society.';
      } else if (userText.includes('ecología') || userText.includes('ecology') || userText.includes('ambiente') || userText.includes('environment') || userText.includes('planeta') || userText.includes('planet')) {
        botResponse = language === 'es'
          ? 'La crisis ecológica actual es también una crisis espiritual. Solo podremos salvar nuestro planeta cuando transformemos nuestra consciencia y entendamos que el respeto por la naturaleza comienza con el respeto por nosotros mismos y por los demás.'
          : 'Today’s ecological crisis is also a spiritual crisis. We can protect our planet only when we transform our consciousness and understand that respect for nature begins with respect for ourselves and for others.';
      } else if (userText.includes('filosofía') || userText.includes('philosophy') || userText.includes('pensamiento') || userText.includes('thought')) {
        botResponse = language === 'es'
          ? 'Mi filosofía se basa en la integración del conocimiento científico, la reflexión ética y la experiencia espiritual. Busco tender puentes entre estas dimensiones para ofrecer una visión más completa y armónica del ser humano y su lugar en el universo.'
          : 'My philosophy is based on integrating scientific knowledge, ethical reflection, and spiritual experience. I seek to build bridges among these dimensions to offer a fuller and more harmonious view of the human being and our place in the universe.';
      } else if (userText.includes('espiritualidad') || userText.includes('spirituality') || userText.includes('consciencia') || userText.includes('consciousness')) {
        botResponse = language === 'es'
          ? 'La espiritualidad auténtica no es escapismo, sino un profundo compromiso con la realidad en todas sus dimensiones. Es el camino para despertar nuestra consciencia y reconocer que somos parte de algo mayor, lo que nos permite vivir con más sentido y responsabilidad.'
          : 'Authentic spirituality is not escapism, but a profound commitment to reality in all its dimensions. It is a path to awakening consciousness and recognizing that we are part of something greater, allowing us to live with more meaning and responsibility.';
      } else if (userText.includes('hola') || userText.includes('saludos') || userText.includes('hello') || userText.includes('hi')) {
        botResponse = language === 'es'
          ? 'Hola, me alegra conversar contigo. ¿Hay algún tema específico sobre mis obras o mi pensamiento que te interese explorar?'
          : 'Hello, I am glad to speak with you. Is there a particular subject in my work or thought that you would like to explore?';
      } else {
        botResponse = language === 'es'
          ? 'Esa es una interesante reflexión. En mis obras he tratado de abordar temas como la consciencia, la espiritualidad, la ética y la ecología desde una perspectiva integradora. ¿Te gustaría profundizar en alguno de estos aspectos?'
          : 'That is an interesting reflection. In my work I address consciousness, spirituality, ethics, and ecology from an integrative perspective. Would you like to explore one of these areas in greater depth?';
      }
      
      const botMessageObj: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessageObj]);
      setIsProcessing(false);
    }, 1500);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      (window as any).dataLayer?.push({
        event: 'chatbot_voice_recording_started'
      });
      
      // In a real implementation, this would activate speech recognition
      setIsRecording(true);
      toast({
        title: language === 'es' ? 'Grabación iniciada' : 'Recording started',
        description: language === 'es'
          ? 'Habla claramente y tu mensaje será transcrito.'
          : 'Speak clearly and your message will be transcribed.',
      });
      
      // Simulate recording and transcription
      setTimeout(() => {
        setIsRecording(false);
        setInputValue(language === 'es' ? '¿Qué es la consciencia transpersonal?' : 'What is transpersonal consciousness?');
        toast({
          title: language === 'es' ? 'Mensaje transcrito' : 'Message transcribed',
          description: language === 'es'
            ? 'Puedes editar el texto o enviarlo directamente.'
            : 'You can edit the text or send it directly.',
        });
      }, 3000);
    } else {
      setIsRecording(false);
      toast({
        title: language === 'es' ? 'Grabación detenida' : 'Recording stopped',
        description: language === 'es'
          ? 'La transcripción ha sido cancelada.'
          : 'The transcription was canceled.',
      });
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh] md:max-h-[700px]">
      {/* Chat header */}
      <div className="bg-navy p-4 rounded-t-lg">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center mr-3">
            <Bot className="text-gold" size={20} />
          </div>
          <div>
            <h2 className="font-heading text-lg font-semibold text-white">Marcos Constandse</h2>
            <p className="text-xs text-white/70">{copy.conversation}</p>
          </div>
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-grow overflow-y-auto p-4 bg-white/50 backdrop-blur-sm">
        <AnimatePresence>
          {showIntro && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-cream-light p-4 rounded-lg mb-6"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-heading text-lg font-semibold mb-2 text-navy-dark">{copy.introTitle}</h3>
                <button 
                  onClick={() => setShowIntro(false)} 
                  className="text-navy-light hover:text-navy"
                  aria-label={copy.closeIntro}
                >
                  ×
                </button>
              </div>
              <p className="text-navy-light text-sm mb-2">
                {copy.introBody}
              </p>
              <p className="text-navy-light text-sm">
                {copy.introHelp}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-navy text-white rounded-br-none' 
                  : 'bg-gold/10 text-navy rounded-bl-none'
              }`}
            >
              <p className="text-sm md:text-base">{message.text}</p>
              <span className="text-xs opacity-70 block text-right mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </motion.div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-start mb-4">
            <div className="bg-gold/10 text-navy rounded-lg rounded-bl-none p-3 max-w-[80%]">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input form */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
        <div className="flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleRecording}
            className={isRecording ? "text-red-500 animate-pulse" : "text-gray-500"}
            aria-label={isRecording ? copy.stopRecording : copy.startRecording}
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </Button>
          
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={copy.placeholder}
            className="flex-grow mx-2"
            disabled={isProcessing}
          />
          
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            disabled={!inputValue.trim() || isProcessing}
            aria-label={copy.send}
          >
            <Send size={20} className={inputValue.trim() ? "text-gold" : "text-gray-300"} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
