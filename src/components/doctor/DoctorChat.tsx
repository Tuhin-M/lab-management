
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Video, VideoOff, Phone, PhoneOff, Send, X } from "lucide-react";
import { toast } from "sonner";
import { doctorChatAPI, authAPI } from "@/services/api";

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    role: string;
  };
  content: string;
  timestamp: string;
}

interface DoctorChatProps {
  doctorId: string;
  doctorName: string;
  doctorImage?: string;
  onClose?: () => void;
}

const DoctorChat: React.FC<DoctorChatProps> = ({
  doctorId,
  doctorName,
  doctorImage,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const currentUser = authAPI.getCurrentUser();
  
  useEffect(() => {
    // Create or get existing chat on component mount
    const initializeChat = async () => {
      try {
        const response = await doctorChatAPI.createChat(doctorId);
        setChatId(response.data._id);
        setMessages(response.data.messages || []);
      } catch (error) {
        console.error("Failed to initialize chat:", error);
        toast.error("Failed to connect to chat. Please try again.");
      }
    };
    
    initializeChat();
    
    // Clean up WebRTC connections when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [doctorId]);
  
  const sendMessage = async () => {
    if (!newMessage.trim() || !chatId) return;
    
    try {
      setIsSending(true);
      await doctorChatAPI.sendMessage(chatId, newMessage);
      
      // Optimistically add message to UI
      const optimisticMessage: Message = {
        _id: Date.now().toString(),
        sender: {
          _id: currentUser?.id || "user",
          name: currentUser?.name || "You",
          role: "user"
        },
        content: newMessage,
        timestamp: new Date().toISOString()
      };
      
      setMessages([...messages, optimisticMessage]);
      setNewMessage("");
      
      // Get updated messages (would be better with a socket connection)
      const response = await doctorChatAPI.getChatById(chatId);
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };
  
  const startVideoCall = async () => {
    try {
      if (!chatId) return;
      
      // Request access to media devices
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      // Store stream for later cleanup
      streamRef.current = stream;
      
      // Display local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Initialize WebRTC peer connection (simplified for demo)
      const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
      peerConnectionRef.current = new RTCPeerConnection(configuration);
      
      // Add local tracks to connection
      stream.getTracks().forEach(track => {
        if (peerConnectionRef.current) {
          peerConnectionRef.current.addTrack(track, stream);
        }
      });
      
      // Setup event handlers for remote streams
      peerConnectionRef.current.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
      
      // In a real app, you would use WebSockets or another method to signal
      // and set up a peer-to-peer connection with the doctor
      toast.success(`Starting video call with Dr. ${doctorName}`);
      setIsVideoCallActive(true);
      
      // Notify server about video call
      await doctorChatAPI.initiateVideoCall(chatId);
    } catch (error) {
      console.error("Failed to start video call:", error);
      toast.error("Could not start video call. Please check your camera and microphone permissions.");
    }
  };
  
  const endVideoCall = async () => {
    try {
      if (!chatId) return;
      
      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      // Close peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      
      // Clear video elements
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
      
      setIsVideoCallActive(false);
      toast.info(`Video call with Dr. ${doctorName} ended`);
      
      // Notify server
      await doctorChatAPI.endVideoCall(chatId);
    } catch (error) {
      console.error("Error ending video call:", error);
    }
  };
  
  return (
    <Card className="w-full h-[600px] max-w-2xl mx-auto">
      <CardHeader className="border-b flex flex-row items-center justify-between py-3">
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={doctorImage} alt={doctorName} />
            <AvatarFallback>{doctorName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">Dr. {doctorName}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {isVideoCallActive ? "In video call" : "Available for chat"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {isVideoCallActive ? (
            <Button 
              variant="destructive"
              size="icon"
              onClick={endVideoCall}
            >
              <VideoOff className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              variant="secondary"
              size="icon"
              onClick={startVideoCall}
            >
              <Video className="h-4 w-4" />
            </Button>
          )}
          {onClose && (
            <Button 
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className={`p-0 flex flex-col ${isVideoCallActive ? 'h-[440px]' : 'h-[480px]'}`}>
        {isVideoCallActive && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 h-52">
            <div className="relative rounded overflow-hidden bg-gray-200 h-full w-full">
              <video 
                ref={remoteVideoRef} 
                className="h-full w-full object-cover"
                autoPlay 
                playsInline
              />
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                Dr. {doctorName}
              </div>
            </div>
            <div className="relative rounded overflow-hidden bg-gray-200 h-full w-full">
              <video 
                ref={localVideoRef} 
                className="h-full w-full object-cover"
                autoPlay 
                playsInline
                muted // Mute local video to prevent feedback
              />
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                You
              </div>
            </div>
          </div>
        )}
        
        <ScrollArea className={`flex-1 p-4 ${isVideoCallActive ? 'h-[250px]' : 'h-[480px]'}`}>
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-center">
              <div>
                <p>No messages yet</p>
                <p className="text-sm">Start the conversation with Dr. {doctorName}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message._id}
                  className={`flex ${message.sender.role === 'doctor' ? 'justify-start' : 'justify-end'}`}
                >
                  <div 
                    className={`max-w-[80%] px-4 py-2 rounded-lg ${
                      message.sender.role === 'doctor' 
                        ? 'bg-secondary text-secondary-foreground' 
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="border-t p-3">
        <form 
          className="flex w-full gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <Input 
            placeholder="Type your message..." 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isSending}
          />
          <Button 
            type="submit"
            disabled={isSending || !newMessage.trim()}
          >
            {isSending ? (
              <span className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default DoctorChat;
