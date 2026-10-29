"use client";


import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    // Add welcome message after a short delay to simulate bot thinking
    setTimeout(() => {
      setMessages([
        {
          id: '1',
          text: 'Hola, soy Marcos Constandse Madrazo. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre mis libros, mi filosofía, o cualquier tema relacionado con la consciencia, la espiritualidad o la ecología.',
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }, 1000);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    (window as any).dataLayer?.push({
      event: 'chatbot_message_sent',
      message_length: inputValue.length,
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
      
      if (userText.includes('humanismo') || userText.includes('evolutivo') || userText.includes('transpersonal')) {
        botResponse = 'El Humanismo Evolutivo plantea una visión transpersonal del ser humano, donde cada individuo no es un ente aislado sino una expresión de la totalidad interconectada. La consciencia transpersonal nos permite trascender los límites del ego y experimentar la unidad con los demás y con la naturaleza. "Yo soy nosotros" expresa esta visión fundamental.';
      } else if (userText.includes('mejor') && userText.includes('venir')) {
        botResponse = '"Y lo mejor aún está por venir" es una invitación a entender la evolución no como un destino sino como una elección. Cada uno de nosotros tiene el poder de decidir su camino hacia la felicidad y la plenitud, tomando las riendas de su propio desarrollo consciente.';
      } else if (userText.includes('empresario') || userText.includes('empresa')) {
        botResponse = 'El arte de ser empresario va mucho más allá de generar ganancias. Es una vocación de servicio donde la ética, la sostenibilidad y el bien común deben ser prioritarios. El verdadero empresario es un agente de cambio positivo en la sociedad.';
      } else if (userText.includes('ecología') || userText.includes('ambiente') || userText.includes('planeta')) {
        botResponse = 'La crisis ecológica actual es también una crisis espiritual. Solo podremos salvar nuestro planeta cuando transformemos nuestra consciencia y entendamos que el respeto por la naturaleza comienza con el respeto por nosotros mismos y por los demás.';
      } else if (userText.includes('filosofía') || userText.includes('pensamiento')) {
        botResponse = 'Mi filosofía se basa en la integración del conocimiento científico, la reflexión ética y la experiencia espiritual. Busco tender puentes entre estas dimensiones para ofrecer una visión más completa y armónica del ser humano y su lugar en el universo.';
      } else if (userText.includes('espiritualidad') || userText.includes('consciencia')) {
        botResponse = 'La espiritualidad auténtica no es escapismo, sino un profundo compromiso con la realidad en todas sus dimensiones. Es el camino para despertar nuestra consciencia y reconocer que somos parte de algo mayor, lo que nos permite vivir con más sentido y responsabilidad.';
      } else if (userText.includes('hola') || userText.includes('saludos')) {
        botResponse = 'Hola, me alegra conversar contigo. ¿Hay algún tema específico sobre mis obras o mi pensamiento que te interese explorar?';
      } else {
        botResponse = 'Esa es una interesante reflexión. En mis obras he tratado de abordar temas como la consciencia, la espiritualidad, la ética y la ecología desde una perspectiva integradora. ¿Te gustaría profundizar en alguno de estos aspectos?';
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
        title: "Grabación iniciada",
        description: "Habla claramente y tu mensaje será transcrito.",
      });
      
      // Simulate recording and transcription
      setTimeout(() => {
        setIsRecording(false);
        setInputValue("¿Qué es la consciencia transpersonal?");
        toast({
          title: "Mensaje transcrito",
          description: "Puedes editar el texto o enviarlo directamente.",
        });
      }, 3000);
    } else {
      setIsRecording(false);
      toast({
        title: "Grabación detenida",
        description: "La transcripción ha sido cancelada.",
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
            <p className="text-xs text-white/70">Conversación Filosófica</p>
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
                <h3 className="font-heading text-lg font-semibold mb-2 text-navy-dark">Bienvenido al Diálogo Filosófico</h3>
                <button 
                  onClick={() => setShowIntro(false)} 
                  className="text-navy-light hover:text-navy"
                  aria-label="Cerrar introducción"
                >
                  ×
                </button>
              </div>
              <p className="text-navy-light text-sm mb-2">
                Esta experiencia te permite interactuar con una simulación del pensamiento de Marcos Constandse Madrazo.
              </p>
              <p className="text-navy-light text-sm">
                Puedes escribir o usar el micrófono para preguntar sobre sus libros, filosofía, o temas relacionados con consciencia, espiritualidad y ecología.
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
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </Button>
          
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-grow mx-2"
            disabled={isProcessing}
          />
          
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            disabled={!inputValue.trim() || isProcessing}
          >
            <Send size={20} className={inputValue.trim() ? "text-gold" : "text-gray-300"} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
